import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '../context/ExpensesContext';
import { getCategoryMeta } from '../data/categories';
import { colors, spacing } from '../theme';

function formatExpenseDate(value) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function ExpenseDetailScreen({ route, navigation }) {
  const { id } = route?.params ?? {};
  const { expenses, removeExpense } = useExpenses();
  const expense = expenses.find((item) => String(item.id) === String(id));

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.('Main', { screen: 'Expenses' });
    }
  };

  const handleDelete = () => {
    if (!expense) return;
    const title = expense.title ?? expense.name ?? expense.nombre;
    Alert.alert(
      'Eliminar gasto',
      `¿Estás seguro de que quieres eliminar "${title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removeExpense(expense.id);
            handleBack();
          },
        },
      ]
    );
  };

  if (!expense) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Detalle del Gasto</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.notFound}>No encontramos un gasto con el id «{id}».</Text>
          <Pressable testID="btn-volver" onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const title = expense.title ?? expense.name ?? expense.nombre;
  const category = expense.category ?? expense.categoria;
  const createdAt = expense.createdAt ?? expense.date;
  const { color: categoryColor } = getCategoryMeta(category);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalle del Gasto</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.amount}>${expense.amount}</Text>
        <Text style={styles.expenseTitle}>{title}</Text>
        <View style={[styles.badge, { borderColor: categoryColor }]}>
          <View style={[styles.dot, { backgroundColor: categoryColor }]} />
          <Text style={[styles.badgeText, { color: categoryColor }]}>{category}</Text>
        </View>

        <View style={styles.fields}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Descripción</Text>
            <Text style={styles.fieldValue}>{title}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Monto</Text>
            <Text style={styles.fieldValue}>${expense.amount}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Categoría</Text>
            <Text style={styles.fieldValue}>{category}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Fecha</Text>
            <Text style={styles.fieldValue}>{formatExpenseDate(createdAt)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Sincronización</Text>
            <Text style={[styles.fieldValue, expense.hasPendingWrites ? styles.syncPending : styles.syncSuccess]}>
              {expense.hasPendingWrites ? '⏳ Pendiente de sincronizar' : '✓ Sincronizado en la nube'}
            </Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Notas</Text>
            <Text style={styles.fieldValue}>{expense.notes || 'Sin notas.'}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable testID="btn-eliminar" onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </Pressable>
          <Pressable testID="btn-volver" onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver</Text>
          </Pressable>
        </View>
      </View>
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
  card: {
    margin: spacing.m,
    marginTop: 0,
    padding: spacing.l,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  expenseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.s,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s + 4,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.m,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  fields: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.m,
    marginBottom: spacing.l,
    gap: spacing.s,
  },
  fieldRow: {
    marginBottom: spacing.s,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text,
    marginTop: 2,
  },
  syncPending: {
    color: '#b45309',
    fontWeight: 'bold',
  },
  syncSuccess: {
    color: '#15803d',
    fontWeight: 'bold',
  },
  notFound: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: spacing.m,
  },
  actions: {
    gap: spacing.s,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    paddingVertical: spacing.m,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.m,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
