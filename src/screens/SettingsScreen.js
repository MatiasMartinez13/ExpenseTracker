import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SETTINGS_STORAGE_KEY } from '../context/ExpensesContext';
import { colors, spacing } from '../theme';

const DEFAULT_SETTINGS = {
  notifications: true,
  darkMode: false,
};

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(DEFAULT_SETTINGS.notifications);
  const [darkMode, setDarkMode] = useState(DEFAULT_SETTINGS.darkMode);
  const [isLoaded, setIsLoaded] = useState(false);

  // Efecto de montaje: hidratación de ajustes desde AsyncStorage
  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings !== null) {
          const parsed = JSON.parse(storedSettings);
          if (parsed && typeof parsed === 'object' && isMounted) {
            if (typeof parsed.notifications === 'boolean') {
              setNotifications(parsed.notifications);
            }
            if (typeof parsed.darkMode === 'boolean') {
              setDarkMode(parsed.darkMode);
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar los ajustes desde AsyncStorage:', error);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Efecto de persistencia: guarda los ajustes solo cuando isLoaded es true
  useEffect(() => {
    if (!isLoaded) return;

    async function saveSettings() {
      try {
        const payload = JSON.stringify({ notifications, darkMode });
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, payload);
      } catch (error) {
        console.error('Error al guardar los ajustes en AsyncStorage:', error);
      }
    }

    saveSettings();
  }, [notifications, darkMode, isLoaded]);

  if (!isLoaded && ActivityIndicator) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator testID="settings-loading-indicator" size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.label}>Notificaciones</Text>
              <Text style={styles.description}>
                Recibir recordatorios para registrar tus gastos diarios.
              </Text>
            </View>
            <Switch
              testID="switch-notifications"
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.label}>Modo oscuro</Text>
              <Text style={styles.description}>
                Usar apariencia oscura en la aplicación.
              </Text>
            </View>
            <Switch
              testID="switch-dark-mode"
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
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
  content: {
    padding: spacing.m,
    paddingTop: 0,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.s,
  },
  rowText: {
    flex: 1,
    marginRight: spacing.m,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.s,
  },
});
