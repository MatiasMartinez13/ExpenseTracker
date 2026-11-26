import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '../context/ExpensesContext';
import { colors, spacing } from '../theme';

export default function WelcomeScreen({ navigation }) {
  const { expenses } = useExpenses();
  const total = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const count = expenses.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>ExpenseTracker</Text>
        <Text style={styles.welcome}>¡Bienvenido a ExpenseTracker!</Text>
        <Text style={styles.description}>
          Esta aplicación te permite registrar y llevar el control de tus gastos personales de forma sencilla.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total registrado</Text>
            <Text style={styles.summaryValue}>${total}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Movimientos</Text>
            <Text style={styles.summaryValue}>{count}</Text>
          </View>
        </View>

        {count === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Todavía no registraste gastos</Text>
          </View>
        ) : null}

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => navigation?.navigate('Expenses')}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Ver mis gastos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => navigation?.navigate('NewExpense')}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Cargar gasto</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: spacing.l,
    paddingTop: 32,
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.s,
    textAlign: 'left',
  },
  description: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'left',
    lineHeight: 21,
    maxWidth: 320,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.l,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: spacing.m,
    marginTop: spacing.m,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  buttonSecondary: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: colors.card,
  },
});
