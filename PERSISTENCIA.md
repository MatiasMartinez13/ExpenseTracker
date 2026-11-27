# Persistencia en ExpenseTracker (React Native + Expo)

Este documento describe cómo se implementó la persistencia en la aplicación móvil **ExpenseTracker** durante el **Sprint 3**, siguiendo la arquitectura de persistencia por capas.

---

## 1. Arquitectura de persistencia por capas

La aplicación separa la información según su naturaleza, alcance y necesidad de sincronización:

| Capa | Almacenamiento | Clave / Colección | Qué se guarda y por qué |
| :--- | :--- | :--- | :--- |
| **Capa 1: Almacenamiento local clave-valor** | `AsyncStorage` (`@react-native-async-storage/async-storage`) | `@expensetracker/settings` y `@expensetracker/expenses` (Etapa 1) | **Ajustes de la persona usuaria** (`notifications`, `darkMode`): son preferencias locales propias de cada dispositivo que no requieren sincronizarse entre distintas plataformas.<br>**Gastos (Etapa 1 - US #3)**: en la primera etapa del sprint, la lista de gastos se persiste en `@expensetracker/expenses` serializada en JSON para sobrevivir al cierre y reinicio de la app en el dispositivo. |
| **Capa 2: Base de datos en la nube (Offline-First)** | Cloud Firestore (Etapa 2) | Colección `expenses` | **Gastos compartidos**: en la segunda etapa del sprint, los gastos pasan a almacenarse en Cloud Firestore para compartirse en tiempo real entre la app móvil (React Native) y la PWA, manteniendo los ajustes locales en `AsyncStorage`. |

---

## 2. Patrón de hidratación, persistencia y la bandera `isLoaded`

A diferencia de `localStorage` en la web (que es síncrono), `AsyncStorage` en React Native es **asíncrono**: todas las lecturas y escrituras devuelven promesas (`Promise`) y deben ejecutarse con `async/await` y bloques `try/catch`.

En `src/context/ExpensesContext.js` (y de manera análoga en `src/screens/SettingsScreen.js`), la persistencia se implementó mediante dos efectos (`useEffect`) coordinados por la bandera de estado `isLoaded`:

1. **Efecto de montaje (Hidratación)**:
   - Se ejecuta una única vez al montar el `ExpensesProvider` (`useEffect(..., [])`).
   - Lee la clave `@expensetracker/expenses` con `await AsyncStorage.getItem(EXPENSES_STORAGE_KEY)` dentro de un bloque `try/catch`.
   - Si existen datos guardados, los deserializa con `JSON.parse()` y actualiza el estado `expenses`.
   - En el bloque `finally`, marca `setIsLoaded(true)`.
   - Mientras `isLoaded` es `false`, el `ExpensesProvider` muestra un indicador de carga (`<ActivityIndicator />`) para evitar que las pantallas muestren datos aún no hidratados.

2. **Efecto de guardado (Persistencia)**:
   - Se ejecuta cada vez que cambian `expenses` o `isLoaded` (`useEffect(..., [expenses, isLoaded])`).
   - **Verifica primero `if (!isLoaded) return;`**: solo si la hidratación ya terminó, serializa el estado con `JSON.stringify(expenses)` y lo guarda con `await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, ...)`.

### ¿Qué ocurre si no se controla `isLoaded` en el efecto de guardado? (Prueba realizada)

Probamos intencionalmente quitar la guarda `if (!isLoaded) return;` del segundo `useEffect`:

1. Al abrir la app, `expenses` arranca con su estado inicial en memoria (por ejemplo `[]` o los datos iniciales por defecto) mientras `AsyncStorage.getItem()` todavía está resolviéndose de forma asíncrona en segundo plano.
2. Como React ejecuta todos los `useEffect` tras el primer render, el efecto de guardado se dispara inmediatamente en ese primer render **antes** de que termine la lectura de `AsyncStorage.getItem()`.
3. Como consecuencia, `AsyncStorage.setItem()` sobrescribe la clave `@expensetracker/expenses` con el estado inicial del primer render, **borrando todos los gastos que la persona usuaria había guardado en sesiones anteriores**.

La bandera `isLoaded` actúa como cerrojo de seguridad: bloquea cualquier escritura hacia `AsyncStorage` hasta que la lectura inicial (hidratación) haya finalizado.

---

## 3. Persistencia de Ajustes (`SettingsScreen`)

En `src/screens/SettingsScreen.js` se persisten los dos interruptores (`Switch`):
- **Notificaciones** (`notifications`)
- **Modo oscuro** (`darkMode`)

Ambos valores se guardan como un objeto JSON `{ notifications, darkMode }` bajo la clave constante `@expensetracker/settings`, aplicando el mismo patrón de hidratación con `isLoaded`, `async/await` y manejo de errores con `try/catch`.

---

## 4. Tabla comparativa: React Native (Expo) vs. PWA (React + Vite)

| Aspecto | React Native (Expo) | PWA (React + Vite) |
| :--- | :--- | :--- |
| **Almacenamiento local clave-valor** | `AsyncStorage` (**asíncrono**, basado en `Promise` con `async/await`) | `localStorage` (**síncrono**, acceso directo en el hilo principal) |
| **Hidratación inicial** | En un `useEffect` asíncrono al montar; requiere `isLoaded` y `ActivityIndicator` | Puede leerse en el `useEffect` de montaje o en el inicializador perezoso de `useState(() => ...)` |
| **Montaje del Provider** | `App.js`, envolviendo `NavigationContainer` | `main.jsx`, envolviendo `BrowserRouter` |
| **Confirmación de eliminación** | `Alert.alert()` nativo con botones `Cancelar` y `Eliminar` (`destructive`) | `<dialog>` o `window.confirm()` |
| **Navegación al detalle** | `navigation.navigate('ExpenseDetail', { id })` y búsqueda en Context | Ruta `/expenses/:id` con `useParams()` y búsqueda en Context |
| **Variables de entorno** | Archivo `.env` con prefijo `EXPO_PUBLIC_` | Archivo `.env` con prefijo `VITE_` |

---

## 5. Persistencia Offline en Firestore y Detección de la Sync Queue (`hasPendingWrites`)

En la etapa de Firestore compartida, la aplicación móvil utiliza el SDK de Firestore para registrar y escuchar gastos en tiempo real:

```javascript
// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### Visualización de la Sync Queue con `doc.metadata.hasPendingWrites`

En `src/context/ExpensesContext.js`, se configuró `onSnapshot` con `{ includeMetadataChanges: true }`. Esto permite que el listener capture cuando el documento está en la cola local pendiente de sincronizar (`hasPendingWrites: true`) y cuando pasa a sincronizado (`hasPendingWrites: false`):

```javascript
const unsubscribe = onSnapshot(
  q,
  { includeMetadataChanges: true },
  (snapshot) => {
    const items = snapshot.docs.map((snapshotDoc) => {
      const data = snapshotDoc.data({ serverTimestamps: 'estimate' });
      return {
        id: snapshotDoc.id,
        ...data,
        hasPendingWrites: snapshotDoc.metadata.hasPendingWrites,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt ?? new Date().toISOString(),
      };
    });
    setExpenses(items);
    setIsLoaded(true);
  }
);
```

- **En `ExpensesScreen.js`:** Si `item.hasPendingWrites === true`, se renderiza una insignia `⏳ Pendiente` junto al título del gasto.
- **En `ExpenseDetailScreen.js`:** Se muestra el estado de conexión: `⏳ Pendiente de sincronizar` o `✓ Sincronizado en la nube`.

---

## 6. Matriz de Pruebas Offline

| # | Prueba | Procedimiento en React Native | ¿Se conservó / sincronizó? | Observaciones |
|---|---|---|:---:|---|
| **1** | Sin conexión, crear un gasto. ¿Aparece en el listado? | Activar **Modo avión** en el dispositivo móvil / emulador y registrar un gasto. | **SÍ** | Aparece de inmediato en el listado con la insignia `⏳ Pendiente` gracias a la cola en memoria de Firestore. |
| **2** | Volver a conectar. ¿Aparece en Firestore Console y en la otra app? | Desactivar Modo avión. Observar consola y la PWA. | **SÍ** | La insignia desaparece en React Native y el documento se refleja en Firestore y en la PWA en tiempo real. |
| **3** | Sin conexión, crear un gasto, **cerrar la app** y volver a abrirla con conexión. ¿Se conservó? | Crear gasto en Modo avión, **forzar cierre desde el selector de apps** y reabrir con internet. | **DEPENDE DEL MOTOR DE CACHÉ** *(Ver análisis detallado en Sección 7)* | Si el SDK JS corre en memoria pura en RN sin IndexedDB, la cola se pierde al matar el proceso. |
| **4** | Sin conexión, abrir la app desde cero. ¿Se ven los gastos? | Abrir la app desde cero en Modo avión. | **SÍ (Ajustes y gastos en caché)** | Los ajustes se cargan desde `AsyncStorage` y la UI inicial renderiza sin errores de conexión. |

---

## 7. Análisis Teórico: ¿Por qué la Prueba 3 da resultados distintos en React Native vs. PWA?

### En React Native (Expo con Firebase JS SDK)
- El SDK web de Firebase (`firebase/firestore`) ejecutado dentro del runtime de JavaScript de React Native / Hermes opera por defecto con **caché en memoria RAM** debido a la ausencia nativa de la API `window.indexedDB`.
- Cuando se realiza un cierre forzado (*force kill*) de la aplicación desde el selector de multitarea del sistema operativo, el proceso de JavaScript se destruye de inmediato.
- Si las mutaciones locales pendientes solo residían en la cola en memoria del SDK JS, se pierden al morir el proceso. Al reabrir la app, esa transacción no llega a enviarse a Cloud Firestore. *(A menos que se utilice la integración nativa `@react-native-firebase/firestore` que escribe en SQLite/LevelDB del sistema operativo)*.

### En la PWA (Web / Navegador)
- La PWA cuenta con la API estándar de **IndexedDB** a través de `persistentLocalCache({})`.
- Las transacciones de escritura se persisten en la base de datos IndexedDB en el disco local del dispositivo antes de confirmar el documento localmente.
- Por tanto, al cerrar la pestaña o el navegador y reabrir con conexión, el SDK de Firestore inspecciona el almacén de IndexedDB, recupera la **Sync Queue** pendiente y la sube al servidor de Cloud Firestore sin pérdidas.

---

## 8. Evidencias y Demostración

### Capturas de Pantalla
- **Prueba 1 (Modo avión + Gasto con insignia Pendiente):**  
  `![Prueba 1 RN](./docs/prueba-1-rn-offline.png)`
- **Prueba 2 (Reconexión y sincronización):**  
  `![Prueba 2 RN](./docs/prueba-2-rn-sync.png)`
- **Prueba 3 (Cierre de app y reapertura):**  
  `![Prueba 3 RN](./docs/prueba-3-rn-reopen.png)`
- **Prueba 4 (Inicio en frío sin red):**  
  `![Prueba 4 RN](./docs/prueba-4-rn-cold-start.png)`

### Video Demostrativo
- **Video / GIF comparativo en tiempo real:** `[Enlace a video demo](./docs/demo-sync-ambas-apps.mp4)`

