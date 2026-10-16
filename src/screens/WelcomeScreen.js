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
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => navigation.navigate('Expenses')}>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Ver mis gastos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => navigation.navigate('NewExpense')}>
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
  
  btnRow: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 24 
  },

  button: { 
    flex: 1, 
    alignItems:'center',
    justifyContent:'center',
    paddingVertical: 12, 
    paddingHorizontal: 8, 
    borderRadius: 10 
  },
  buttonSecondary: { 
    backgroundColor: colors.primary, 
    borderColor: colors.primary,
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
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
