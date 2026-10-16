import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from '../screens/WelcomeScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import NewExpenseModal from '../screens/NewExpenseModal';
import { Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

export default function TabNavigator(){
    return (
        <Tab.Navigator>
            <Tab.Screen name="Welcome" component={WelcomeScreen} options={{title: 'Inicio', tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} /> }}/>
            <Tab.Screen name="Expenses" component={ExpensesScreen} options={{title: 'Gastos', tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} /> }}/>
            <Tab.Screen name="NewExpense" component={NewExpenseModal} options={{title: 'Nuevo Gasto', tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} /> }}/>
        </Tab.Navigator>
    )
}