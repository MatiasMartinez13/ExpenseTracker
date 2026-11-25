import { createStackNavigator } from '@react-navigation/stack';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import NewExpenseModal from '../screens/NewExpenseModal';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
      <Stack.Screen
        name="NewExpense"
        component={NewExpenseModal}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
