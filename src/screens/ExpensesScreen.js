import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, categoryColors } from '../theme';
import { deleteGasto, getGastos, getGastosSync } from '../services/gastosService';
import { useFocusEffect } from '@react-navigation/native';


function ExpenseItem({ id, nombre, categoria, amount, onDelete }) {
  const dotColor = categoryColors[categoria] ?? colors.muted;
  return (
    <View style={styles.item}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={styles.itemText}>
        <Text style={styles.description}>{nombre}</Text>
        <Text style={[styles.category, { color: dotColor }]}>{categoria}</Text>
      </View>
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

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis gastos</Text>
      </View>
      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ExpenseItem id={item.id} nombre={item.nombre} categoria={item.categoria} amount={item.amount} onDelete={handleDelete} />
        )}
        ListFooterComponent={() => (
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total ({expenses.length} gastos)</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
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
  category: {
    fontSize: 13,
    fontWeight: '600',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.s,
  },
  itemText: {
    flex: 1,
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
  totalBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    alignItems: 'center',
    marginTop: spacing.s,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
});
