module.exports = {
  testEnvironment: 'node',
  globals: {
    __DEV__: true,
  },
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-screens|react-native-gesture-handler|react-native-safe-area-context|expo|@expo)/)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'android.js', 'ios.js', 'json'],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  haste: {
    defaultPlatform: 'android',
    platforms: ['android', 'ios'],
  },
  setupFiles: ['./src/setupTests.js'],
};
