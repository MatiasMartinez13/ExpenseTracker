import React from 'react';
import renderer, { act } from 'react-test-renderer';

// Mock ligero de react-native para evitar el puente nativo en entorno de prueba
jest.mock('react-native', () => {
  const React = require('react');
  const mockComponent = (name) => (props) => React.createElement(name, props, props.children);
  return {
    View: mockComponent('View'),
    Text: mockComponent('Text'),
    TextInput: mockComponent('TextInput'),
    Pressable: mockComponent('Pressable'),
    SafeAreaView: mockComponent('SafeAreaView'),
    StyleSheet: {
      create: (styles) => styles,
    },
    Alert: {
      alert: jest.fn(),
    },
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaView: (props) => React.createElement('SafeAreaView', null, props.children),
  };
});

import { Alert, Pressable, TextInput } from 'react-native';
import NewExpenseModal from '../NewExpenseModal';

function renderScreen() {
  let component;
  act(() => {
    component = renderer.create(<NewExpenseModal />);
  });
  return component;
}

function findButton(component, testID) {
  return component.root.findAllByType(Pressable).find((node) => node.props.testID === testID);
}

describe('NewExpenseModal - User Story: Construir formulario de carga de gastos', () => {
  beforeEach(() => {
    Alert.alert.mockClear();
  });

  test('renderiza sin errores', () => {
    expect(renderScreen().toJSON()).toBeTruthy();
  });

  test('existe un TextInput para el nombre', () => {
    const screen = renderScreen();
    const inputs = screen.root.findAllByType(TextInput);
    const nombre = inputs.find((input) => input.props.testID === 'input-nombre');
    expect(nombre).toBeTruthy();
    expect(nombre.props.value).toBeDefined();
    expect(typeof nombre.props.onChangeText).toBe('function');
  });

  test('existe un TextInput para el monto', () => {
    const screen = renderScreen();
    const inputs = screen.root.findAllByType(TextInput);
    const monto = inputs.find((input) => input.props.testID === 'input-monto');
    expect(monto).toBeTruthy();
    expect(monto.props.keyboardType).toBe('numeric');
  });

  test('existe un campo para seleccionar la categoría', () => {
    const screen = renderScreen();
    const tree = JSON.stringify(screen.toJSON());
    expect(tree).toContain('Comida');
    expect(tree).toContain('Transporte');
    expect(tree).toContain('Otros');
  });

  test('existe un botón funcional Guardar', () => {
    const screen = renderScreen();
    const boton = findButton(screen, 'btn-guardar');
    expect(boton).toBeTruthy();
    expect(typeof boton.props.onPress).toBe('function');
    expect(JSON.stringify(screen.toJSON())).toContain('Guardar');
  });

  test('el botón Guardar ejecuta una acción simple al presionarlo', () => {
    const screen = renderScreen();
    act(() => {
      findButton(screen, 'btn-guardar').props.onPress();
    });
    expect(Alert.alert).toHaveBeenCalled();
  });

  test('se puede escribir en los inputs y el botón refleja los datos cargados', () => {
    const screen = renderScreen();
    const inputs = screen.root.findAllByType(TextInput);
    const nombre = inputs.find((input) => input.props.testID === 'input-nombre');

    act(() => {
      nombre.props.onChangeText('Supermercado');
    });

    act(() => {
      findButton(screen, 'btn-guardar').props.onPress();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Nuevo gasto',
      expect.stringContaining('Supermercado')
    );
  });

  test('se puede cambiar la categoría seleccionada', () => {
    const screen = renderScreen();
    act(() => {
      findButton(screen, 'categoria-Transporte').props.onPress();
    });
    act(() => {
      findButton(screen, 'btn-guardar').props.onPress();
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      'Nuevo gasto',
      expect.stringContaining('Transporte')
    );
  });
});
