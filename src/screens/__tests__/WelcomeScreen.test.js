import React from 'react';
import renderer from 'react-test-renderer';

// Mock ligero de react-native para evitar el puente nativo en entorno de prueba
jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: (props) => React.createElement('View', null, props.children),
    Text: (props) => React.createElement('Text', null, props.children),
    SafeAreaView: (props) => React.createElement('SafeAreaView', null, props.children),
    StyleSheet: {
      create: (styles) => styles,
    },
  };
});

import WelcomeScreen from '../WelcomeScreen';

describe('WelcomeScreen - User Story #3: Construir pantalla de bienvenida', () => {
  test('renderiza sin errores', () => {
    const tree = renderer.create(<WelcomeScreen />).toJSON();
    expect(tree).toBeTruthy();
  });

  test('muestra el nombre ExpenseTracker', () => {
    const tree = JSON.stringify(renderer.create(<WelcomeScreen />).toJSON());
    expect(tree).toContain('ExpenseTracker');
  });

  test('muestra un mensaje de bienvenida', () => {
    const tree = JSON.stringify(renderer.create(<WelcomeScreen />).toJSON());
    expect(tree).toContain('¡Bienvenido a ExpenseTracker!');
  });

  test('muestra una descripción de registro de gastos', () => {
    const tree = JSON.stringify(renderer.create(<WelcomeScreen />).toJSON());
    expect(tree).toMatch(/registrar.*gastos/i);
  });
});
