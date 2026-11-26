import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '../context/ExpensesContext';
import { CATEGORIES } from '../data/categories';
import { colors, spacing } from '../theme';

export default function NewExpenseModal({ navigation }) {
  const { addExpense } = useExpenses();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    const trimmedTitle = name.trim();
    const numericAmount = Number(String(amount).trim().replace(',', '.'));

    if (!trimmedTitle || !String(amount).trim() || Number.isNaN(numericAmount) || numericAmount <= 0 || !category) {
      Alert.alert('Error', 'Ingresa un nombre válido y un monto mayor a cero.');
      return;
    }

    addExpense({
      title: trimmedTitle,
      amount: numericAmount,
      category,
      notes: notes.trim(),
    });

    Alert.alert(
      'Nuevo gasto',
      `Nombre: ${trimmedTitle}\nMonto: $${numericAmount}\nCategoría: ${category}`
    );

    setName('');
    setAmount('');
    setCategory(CATEGORIES[0]);
    setNotes('');

    navigation?.navigate?.('Expenses');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nuevo gasto</Text>

        <Text style={styles.label}>Nombre del gasto</Text>
        <TextInput
          testID="input-nombre"
          style={styles.input}
          placeholder="Ej: Supermercado"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Monto</Text>
        <TextInput
          testID="input-monto"
          style={styles.input}
          placeholder="Ej: 1500"
          placeholderTextColor={colors.muted}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.categories}>
          {CATEGORIES.map((item) => (
            <Pressable
              key={item}
              testID={`categoria-${item}`}
              onPress={() => setCategory(item)}
              style={[styles.chip, category === item && styles.chipSelected]}
            >
              <Text style={[styles.chipText, category === item && styles.chipTextSelected]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Notas (opcional)</Text>
        <TextInput
          testID="input-notas"
          style={styles.input}
          placeholder="Ej: Compra semanal"
          placeholderTextColor={colors.muted}
          value={notes}
          onChangeText={setNotes}
        />

        <Pressable testID="btn-guardar" onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Guardar</Text>
        </Pressable>
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
    padding: spacing.l,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.l,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.s,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s + 4,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.m,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.card,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.m,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
