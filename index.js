import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent llama a AppRegistry.registerComponent('main', () => App)
// y asegura que el entorno esté bien configurado tanto en Expo Go como en un build nativo.
registerRootComponent(App);
