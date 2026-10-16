import React, { act } from 'react';
import renderer from 'react-test-renderer';

// En React 19 el render debe ejecutarse dentro de act() para volcarse de forma síncrona.
const render = (element) => {
  let instance;
  act(() => {
    instance = renderer.create(element);
  });
  return instance;
};

// Mock ligero de react-native para evitar el puente nativo en entorno de prueba.
// FlatList se implementa para renderizar sus items directamente.
jest.mock('react-native', () => {
  const React = require('react');
  const FlatList = ({ data, renderItem }) =>
    React.createElement(
      'FlatList',
      null,
      data.map((item, index) =>
        React.createElement('FlatListItem', { key: item.id || index }, renderItem({ item }))
      )
    );
  return {
    View: (props) => React.createElement('View', null, props.children),
    Text: (props) => React.createElement('Text', null, props.children),
    FlatList,
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

import ExpensesScreen from '../ExpensesScreen';

describe('ExpensesScreen - User Story #main-s1-us5: Construir listado de gastos', () => {
  test('renderiza sin errores', () => {
    const tree = render(<ExpensesScreen />).toJSON();
    expect(tree).toBeTruthy();
  });

  test('muestra múltiples gastos', () => {
    const instance = render(<ExpensesScreen />);
    const texts = JSON.stringify(instance.toJSON());
    expect(texts).toContain('Supermercado');
    expect(texts).toContain('Combustible');
    expect(texts).toContain('Internet');
  });

  test('los gastos aparecen ordenados como lista', () => {
    const instance = render(<ExpensesScreen />);
    const list = JSON.stringify(instance.toJSON());
    const supermercadoIndex = list.indexOf('Supermercado');
    const combustibleIndex = list.indexOf('Combustible');
    const internetIndex = list.indexOf('Internet');
    expect(supermercadoIndex).toBeGreaterThan(-1);
    expect(combustibleIndex).toBeGreaterThan(supermercadoIndex);
    expect(internetIndex).toBeGreaterThan(combustibleIndex);
  });

  test('cada gasto muestra descripción y monto', () => {
    const instance = render(<ExpensesScreen />);
    const tree = JSON.stringify(instance.toJSON());
    expect(tree).toContain('25000');
    expect(tree).toContain('18000');
    expect(tree).toContain('32000');
  });
});
