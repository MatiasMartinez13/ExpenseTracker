import React from 'react';
import renderer, { act } from 'react-test-renderer';

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

function renderTree() {
  let component;
  act(() => {
    component = renderer.create(<WelcomeScreen />);
  });
  return component.toJSON();
}

describe('WelcomeScreen - User Story #3: Construir pantalla de bienvenida', () => {
  test('renderiza sin errores', () => {
    expect(renderTree()).toBeTruthy();
  });

  test('muestra el nombre ExpenseTracker', () => {
    expect(JSON.stringify(renderTree())).toContain('ExpenseTracker');
  });

  test('muestra un mensaje de bienvenida', () => {
    expect(JSON.stringify(renderTree())).toContain('¡Bienvenido a ExpenseTracker!');
  });

  test('muestra una descripción de registro de gastos', () => {
    expect(JSON.stringify(renderTree())).toMatch(/registrar.*gastos/i);
  });
});
