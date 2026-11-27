import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ExpensesProvider } from './src/context/ExpensesContext';
import OfflineBanner from './src/components/OfflineBanner';
import StackNavigator from './src/navigation/StackNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ExpensesProvider>
          <OfflineBanner />
          <NavigationContainer>
            <StackNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </ExpensesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
