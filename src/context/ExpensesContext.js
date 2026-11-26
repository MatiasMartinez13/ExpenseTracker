import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES } from '../data/categories';
import { colors } from '../theme';

export const EXPENSES_STORAGE_KEY = '@expensetracker/expenses';
export const SETTINGS_STORAGE_KEY = '@expensetracker/settings';

const INITIAL_EXPENSES = [
  {
    id: '1',
    title: 'Supermercado',
    amount: 25000,
    category: 'Comida',
    notes: 'Compra semanal: verduras, lácteos y productos de limpieza.',
    createdAt: '2026-10-25T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'Combustible',
    amount: 18000,
    category: 'Transporte',
    notes: 'Carga completa de nafta para el auto.',
    createdAt: '2026-10-27T12:00:00.000Z',
  },
  {
    id: '3',
    title: 'Internet',
    amount: 32000,
    category: 'Servicios',
    notes: 'Abono mensual de fibra óptica 300 Mbps.',
    createdAt: '2026-10-29T12:00:00.000Z',
  },
];

const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Efecto de montaje: hidratación desde AsyncStorage
  useEffect(() => {
    let isMounted = true;

    async function loadExpenses() {
      try {
        const storedExpenses = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
        if (storedExpenses !== null) {
          const parsed = JSON.parse(storedExpenses);
          if (Array.isArray(parsed) && isMounted) {
            setExpenses(parsed);
          }
        }
      } catch (error) {
        console.error('Error al cargar los gastos desde AsyncStorage:', error);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    loadExpenses();

    return () => {
      isMounted = false;
    };
  }, []);

  // Efecto de persistencia: guarda cada vez que cambian los gastos, solo si isLoaded es true
  useEffect(() => {
    if (!isLoaded) return;

    async function saveExpenses() {
      try {
        await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
      } catch (error) {
        console.error('Error al guardar los gastos en AsyncStorage:', error);
      }
    }

    saveExpenses();
  }, [expenses, isLoaded]);

  const addExpense = (data) => {
    const title = String(data?.title ?? data?.name ?? data?.nombre ?? '').trim();
    const amount = Number(data?.amount);
    if (!title || Number.isNaN(amount) || amount <= 0) {
      return null;
    }

    const newExpense = {
      id: data?.id != null ? String(data.id) : Date.now().toString(),
      title,
      amount,
      category: data?.category ?? data?.categoria ?? CATEGORIES[0],
      notes: String(data?.notes ?? '').trim(),
      createdAt: data?.createdAt ?? data?.date ?? new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  };

  const removeExpense = (id) => {
    const targetId = String(id);
    setExpenses((prev) => prev.filter((item) => String(item.id) !== targetId));
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        isLoaded,
        addExpense,
        removeExpense,
      }}
    >
      {!isLoaded && ActivityIndicator ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator testID="loading-indicator" size="large" color={colors.primary} />
        </View>
      ) : (
        children
      )}
    </ExpensesContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses debe usarse dentro de un ExpensesProvider');
  }
  return context;
}

export default ExpensesContext;
