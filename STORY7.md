# Story 7 — Bonus 1: informe de cambios

Corresponde al commit `6499b2e Enhance expense list and welcome screen`.
Verificación: `npm test` → `Test Suites: 3 passed, 3 total` / `Tests: 16 passed, 16 total`.

## 1. Íconos con Expo Vector Icons (`src/navigation/TabNavigator.js`)

Cada tab tenía el mismo ícono `list`. Ahora cada uno tiene el suyo vía
`tabBarIcon` de `@react-navigation/bottom-tabs` + `Ionicons` de `@expo/vector-icons`:

| Tab | Ícono |
|---|---|
| `Welcome` (Inicio) | `home` |
| `Expenses` (Gastos) | `receipt` |
| `NewExpense` (Nuevo Gasto) | `add-circle` |

El callback `({ color, size }) => <Ionicons ... />` lo provee el tab bar:
`color` refleja el estado activo/inactivo y `size` el tamaño estándar,
así los íconos siguen el tema de navegación sin estilos manuales.

## 2. Colores por categoría (`src/screens/ExpensesScreen.js`, `src/theme.js`, `src/data/gastos.json`, `src/services/gastosService.js`)

- `theme.js` ya exponía `categoryColors` (`Comida`, `Transporte`, `Ocio`, `Salud`, `Otros`); no se tocó.
- `ExpenseItem` ahora recibe `categoria` y resuelve `categoryColors[categoria] ?? colors.muted`
  (el fallback evita un punto invisible si llega una categoría desconocida).
- Renderiza un punto (`styles.dot`, 12px circular) + el nombre de la categoría
  teñido con ese mismo color (`styles.category`), al lado de `nombre` y `amount`.
- Normalización `Otro` → `Otros`: `gastos.json` traía `"categoria": "Otro"` (singular)
  y el default de `addGasto` también, pero el mapa y `CATEGORIES` usan `"Otros"`.
  Sin esto el lookup daba `undefined`. Los datos de ejemplo quedaron:
  `Supermercado/Comida`, `Combustible/Transporte`, `Internet/Otros`.

## 3. Total al final del listado (`src/screens/ExpensesScreen.js`)

- `const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)` recalcula
  en cada render, por lo que se actualiza solo al agregar o borrar gastos
  (`setExpenses` tras `addGasto`/`deleteGasto` + recarga en `useFocusEffect`).
- Se muestra con `FlatList` → `ListFooterComponent` (`styles.totalBox`):
  `Total (N gastos)` + `$total`. Al ser footer y no un item más, queda siempre
  fijo al final sin ensuciar `keyExtractor` ni el borrado por `id`.

## 4. Imagen con `assets` (`src/assets/welcome.png`, `src/screens/WelcomeScreen.js`)

- Se agregó el binario `src/assets/welcome.png` (400×300, tarjeta índigo
  con monedas, acorde a `colors.primary`).
- `WelcomeScreen.js` lo muestra entre la descripción y los botones:
  `<Image source={require('../assets/welcome.png')} style={styles.heroImage} />`
  (`width: 100%`, `height: 180`, `borderRadius: 20`). El `require` estático permite
  que Metro lo empaquete; `app.json` ya incluía `"assetBundlePatterns": ["**/*"]`,
  no hizo falta tocarlo.

## 5. Cambios de soporte

- `WelcomeScreen.js`: se corrigió `buttonSecondary` (tenía `borderColor` duplicado;
  quedó `colors.primary`) y `buttonText` pasó a `14px` + `textAlign: center`
  para los botones lado a lado.
- Tests: `require('*.png')` rompe Jest (`unexpected token`), por eso
  `jest.config.js` mapea imágenes a `src/__mocks__/fileMock.js` y
  `WelcomeScreen.test.js` mockea `Image` de `react-native`.
- `NewExpenseModal.test.js` (commit `f2f523c`, previo): los tests cargan
  `nombre` + `monto` antes de guardar, acorde a la validación
  `if (!name || !amount ...)`, y mockean `AsyncStorage`/`addGasto` porque
  el storage real no existe en entorno `node` (`window is not defined`).

## Cómo probarlo

```bash
npm install
npm test            # 3 suites / 16 tests en verde
npx expo start --clear
```

Ver en el dispositivo: inicio con imagen, 3 tabs con íconos distintos,
gastos con punto de color por categoría y total al pie.
