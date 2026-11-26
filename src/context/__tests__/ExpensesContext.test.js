import React from 'react';
import renderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('react-native', () => {
  const React = require('react');
  const mockComponent = (name) => (props) => React.createElement(name, props, props.children);
  return {
    View: mockComponent('View'),
    Text: mockComponent('Text'),
    Switch: mockComponent('Switch'),
    ActivityIndicator: mockComponent('ActivityIndicator'),
    StyleSheet: {
      create: (styles) => styles,
    },
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaView: (props) => React.createElement('SafeAreaView', null, props.children),
  };
});

import { ActivityIndicator, Switch } from 'react-native';
import {
  ExpensesProvider,
  useExpenses,
  EXPENSES_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
} from '../ExpensesContext';
import SettingsScreen from '../../screens/SettingsScreen';

function TestConsumer({ onReady }) {
  const ctx = useExpenses();
  onReady(ctx);
  return null;
}

describe('User Story #rn-s3-us3: Persistencia local con AsyncStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('muestra ActivityIndicator mientras isLoaded es false y luego hidrata los gastos', async () => {
    const customExpenses = [
      {
        id: '99',
        title: 'Farmacia',
        amount: 9500,
        category: 'Salud',
        notes: 'Analgesicos',
        createdAt: '2026-11-01T10:00:00.000Z',
      },
    ];
    await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(customExpenses));

    let latestCtx;
    let tree;

    // Primer render antes de que termine la promesa de hidratación
    act(() => {
      tree = renderer.create(
        <ExpensesProvider>
          <TestConsumer onReady={(ctx) => { latestCtx = ctx; }} />
        </ExpensesProvider>
      );
    });

    // Mientras isLoaded es false se muestra el ActivityIndicator y NO se sobreescribe AsyncStorage
    expect(tree.root.findAllByType(ActivityIndicator).length).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1); // solo el setItem del arrange

    // Esperar a que termine el efecto de hidratación
    await act(async () => {
      await Promise.resolve();
    });

    expect(latestCtx.isLoaded).toBe(true);
    expect(latestCtx.expenses).toEqual(customExpenses);
  });

  test('persiste en AsyncStorage al agregar y eliminar un gasto una vez hidratado', async () => {
    let latestCtx;

    await act(async () => {
      renderer.create(
        <ExpensesProvider>
          <TestConsumer onReady={(ctx) => { latestCtx = ctx; }} />
        </ExpensesProvider>
      );
    });

    expect(latestCtx.isLoaded).toBe(true);

    await act(async () => {
      latestCtx.addExpense({
        id: '500',
        title: 'Gimnasio',
        amount: 15000,
        category: 'Salud',
        notes: 'Cuota mensual',
      });
    });

    const savedAfterAdd = JSON.parse(await AsyncStorage.getItem(EXPENSES_STORAGE_KEY));
    expect(savedAfterAdd.some((item) => item.id === '500' && item.title === 'Gimnasio')).toBe(true);

    await act(async () => {
      latestCtx.removeExpense('500');
    });

    const savedAfterRemove = JSON.parse(await AsyncStorage.getItem(EXPENSES_STORAGE_KEY));
    expect(savedAfterRemove.some((item) => item.id === '500')).toBe(false);
  });

  test('SettingsScreen hidrata y persiste los dos Switch (notificaciones y modo oscuro)', async () => {
    await AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ notifications: false, darkMode: true })
    );

    let screen;
    await act(async () => {
      screen = renderer.create(<SettingsScreen />);
    });

    const switches = screen.root.findAllByType(Switch);
    const notifSwitch = switches.find((s) => s.props.testID === 'switch-notifications');
    const darkSwitch = switches.find((s) => s.props.testID === 'switch-dark-mode');

    expect(notifSwitch.props.value).toBe(false);
    expect(darkSwitch.props.value).toBe(true);

    // Cambiar el valor de los switches
    await act(async () => {
      notifSwitch.props.onValueChange(true);
      darkSwitch.props.onValueChange(false);
    });

    const stored = JSON.parse(await AsyncStorage.getItem(SETTINGS_STORAGE_KEY));
    expect(stored).toEqual({ notifications: true, darkMode: false });
  });
});
