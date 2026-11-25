import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '../context/ExpensesContext';
import { getCategoryMeta } from '../data/categories';
import { colors, spacing } from '../theme';

function ExpenseItem({ item, onPress, onDelete }) {
  const title = item.title ?? item.name ?? item.nombre;
  const category = item.category ?? item.categoria;
  const { color: dotColor } = getCategoryMeta(category);

  return (
    <View style={styles.item}>
      <Pressable
        testID={`item-gasto-${item.id}`}
        onPress={() => onPress?.(item.id)}
        style={styles.itemContent}
      >
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <View style={styles.itemText}>
          <Text style={styles.description}>{title}</Text>
          {category ? <Text style={[styles.category, { color: dotColor }]}>{category}</Text> : null}
        </View>
        <Text style={styles.amount}>${item.amount}</Text>
      </Pressable>
      <Pressable testID={`btn-borrar-${item.id}`} onPress={() => onDelete(item.id)} style={styles.trash}>
        <Text style={styles.trashText}>❌</Text>
      </Pressable>
    </View>
  );
}

export default function ExpensesScreen({ navigation }) {
  const { expenses, removeExpense } = useExpenses();
  const total = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const handleOpenDetail = (id) => {
    navigation?.navigate('ExpenseDetail', { id });
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
          <ExpenseItem item={item} onPress={handleOpenDetail} onDelete={removeExpense} />
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
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  category: {
    fontSize: 13,
    fontWeight: '600',
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
