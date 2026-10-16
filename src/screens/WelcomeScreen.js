import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { colors, spacing } from '../theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>ExpenseTracker</Text>
        <Text style={styles.welcome}>¡Bienvenido a ExpenseTracker!</Text>
        <Text style={styles.description}>
          Esta aplicación te permite registrar y llevar el control de tus gastos personales de forma sencilla.
        </Text>
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
});
