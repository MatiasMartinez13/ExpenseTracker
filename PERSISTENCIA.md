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
