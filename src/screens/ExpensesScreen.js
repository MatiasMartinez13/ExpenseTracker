import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, categoryColors } from '../theme';
// Datos de ejemplo definidos manualmente para visualizar el listado (User Story #5).
const EXPENSES = [
  { id: '1', description: 'Supermercado', amount: 25000, category: 'Comida' },
  { id: '2', description: 'Combustible', amount: 18000, category: 'Transporte' },
  { id: '3', description: 'Internet', amount: 32000, category: 'Otros' },
];

function ExpenseItem({ description, amount, category }) {
  return (
    <View style={styles.item}>
      <View style={{ width:12, height:12, borderRadius:6, backgroundColor: categoryColors[category] }} />
      <Text style={styles.description}>{description} · {category}</Text>
      <Text style={styles.amount}>${amount}</Text>
    </View>
  );
}

export default function ExpensesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis gastos</Text>
      </View>
      <FlatList
        data={EXPENSES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem description={item.description} amount={item.amount} category={item.category} />
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
});
