import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>ExpenseTracker</Text>
        <Text style={styles.welcome}>¡Bienvenido a ExpenseTracker!</Text>
        <Text style={styles.description}>
          Esta aplicación te permite registrar y llevar el control de tus gastos personales de forma sencilla.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Expenses')}
        >
          <Text style={styles.buttonText}>Ver mis gastos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.navigate('NewExpense')}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Cargar gasto</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.s,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  button: {
    marginTop: spacing.l,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonSecondary: {
    marginTop: spacing.m,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
});
