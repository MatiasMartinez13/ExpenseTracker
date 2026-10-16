import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { deleteGasto, getGastos, getGastosSync } from '../services/gastosService';
import { useFocusEffect } from '@react-navigation/native';


function ExpenseItem({ id, nombre, amount, onDelete }) {
  return (
    <View style={styles.item}>
      <Text style={styles.description}>{nombre}</Text>
      <Text style={styles.amount}>${amount}</Text>
      <Pressable testID={`btn-borrar-${id}`} onPress={() => onDelete(id)} style={styles.trash}>
        <Text style={styles.trashText}>❌</Text>
      </Pressable>
    </View>
  );
}

export default function ExpensesScreen() {
  
  const [expenses,setExpenses] = useState(() => getGastosSync())
  useFocusEffect(
    useCallback(() => {
      getGastos().then(setExpenses);
    }, [])
  )

  const handleDelete = async (id) => {
    const actualizados = await deleteGasto(id);
    setExpenses([...actualizados]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis gastos</Text>
      </View>
      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ExpenseItem id={item.id} nombre={item.nombre} amount={item.amount} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.l,
    paddingBottom: spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  list: {
    padding: spacing.m,
    paddingTop: 0,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    marginBottom: spacing.s,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  trash: {
    padding: spacing.s,
    marginLeft: spacing.s,
  },
  trashText: {
    fontSize: 20,
  },
});
