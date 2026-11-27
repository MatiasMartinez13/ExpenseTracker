global.__fbBatchedBridgeConfig = {};
global.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key) => (store.has(key) ? store.get(key) : null)),
      setItem: jest.fn(async (key, value) => {
        store.set(key, String(value));
      }),
      removeItem: jest.fn(async (key) => {
        store.delete(key);
      }),
      clear: jest.fn(async () => {
        store.clear();
      }),
    },
  };
}, { virtual: true });

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => jest.fn()),
    fetch: jest.fn(async () => ({
      isConnected: true,
      isInternetReachable: true,
    })),
  },
}), { virtual: true });

jest.mock('firebase/auth', () => ({
  __esModule: true,
  getAuth: jest.fn(() => ({ currentUser: { uid: 'test-uid' } })),
  initializeAuth: jest.fn(() => ({ currentUser: { uid: 'test-uid' } })),
  getReactNativePersistence: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((_auth, callback) => {
    callback({ uid: 'test-uid' });
    return jest.fn();
  }),
  signInAnonymously: jest.fn(async () => ({ user: { uid: 'test-uid' } })),
}));
