/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import { useHistory } from 'react-router-dom';
import { subjects } from '../../services/categories';

import { getByTestId, render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import Search from './Search';
import '@testing-library/jest-dom/extend-expect';

beforeEach(() => {
  render(<Search />);
});

test('Title label renders correctly', () => {
  expect(screen.getByLabelText('Title')).toBeInTheDocument();
});

test('Author label renders correctly', () => {
  expect(screen.getByLabelText('Author')).toBeInTheDocument();
});

test('Journal label renders correctly', () => {
  expect(screen.getByLabelText('Title')).toBeInTheDocument();
});

test('Abstract label renders correctly', () => {
  expect(screen.getByLabelText('Title')).toBeInTheDocument();
});

test('Loads datepicker correctly', () => {
  expect(screen.getByTestId('date-picker')).toBeInTheDocument();
});

test('From label renders correctly', () => {
  expect(screen.getByLabelText(/From/)).toBeInTheDocument();
});

test('To label renders correctly', () => {
  expect(screen.getByLabelText(/to/)).toBeInTheDocument();
});

test('Text subject renders correctly', () => {
  expect(screen.getByText('Subject')).toBeInTheDocument();
});

test('Text Physics renders correctly', () => {
  expect(screen.getByText('Physics')).toBeInTheDocument();
});

test('Text Computer Science renders correctly', () => {
  expect(screen.getByText('Computer Science')).toBeInTheDocument();
});

test('Computer Science checkbox works correctly', () => {
  const compSciCheckBox = screen.getByTestId('checkbox-Computer Science');
  expect(compSciCheckBox.checked).toEqual(false);
  fireEvent.click(compSciCheckBox);
  expect(compSciCheckBox.checked).toEqual(true);
  fireEvent.click(compSciCheckBox);
  expect(compSciCheckBox.checked).toEqual(false);
});

test('Physics checkbox works correctly', () => {
  const physicsCheckBox = screen.getByTestId('checkbox-Physics');
  expect(physicsCheckBox.checked).toEqual(false);
  fireEvent.click(physicsCheckBox);
  expect(physicsCheckBox.checked).toEqual(true);
  fireEvent.click(physicsCheckBox);
  expect(physicsCheckBox.checked).toEqual(false);
});

test('Mathematics checkbox works correctly', () => {
  const mathCheckBox = screen.getByTestId('checkbox-Mathematics');
  expect(mathCheckBox.checked).toEqual(false);
  fireEvent.click(mathCheckBox);
  expect(mathCheckBox.checked).toEqual(true);
  fireEvent.click(mathCheckBox);
  expect(mathCheckBox.checked).toEqual(false);
});

test('Electrical Engineering and Systems Science checkbox works correctly', () => {
  const electCheckBox = screen.getByTestId('checkbox-Electrical Engineering and Systems Science');
  expect(electCheckBox.checked).toEqual(false);
  fireEvent.click(electCheckBox);
  expect(electCheckBox.checked).toEqual(true);
  fireEvent.click(electCheckBox);
  expect(electCheckBox.checked).toEqual(false);
});

test('Economics checkbox works correctly', () => {
  const economicsCheckBox = screen.getByTestId('checkbox-Economics');
  expect(economicsCheckBox.checked).toEqual(false);
  fireEvent.click(economicsCheckBox);
  expect(economicsCheckBox.checked).toEqual(true);
  fireEvent.click(economicsCheckBox);
  expect(economicsCheckBox.checked).toEqual(false);
});

test('Quantitative Biology checkbox works correctly', () => {
  const quantCheckBox = screen.getByTestId('checkbox-Quantitative Biology');
  expect(quantCheckBox.checked).toEqual(false);
  fireEvent.click(quantCheckBox);
  expect(quantCheckBox.checked).toEqual(true);
  fireEvent.click(quantCheckBox);
  expect(quantCheckBox.checked).toEqual(false);
});

test('Quantitative Finance checkbox works correctly', () => {
  const quantFinCheckBox = screen.getByTestId('checkbox-Quantitative Finance');
  expect(quantFinCheckBox.checked).toEqual(false);
  fireEvent.click(quantFinCheckBox);
  expect(quantFinCheckBox.checked).toEqual(true);
  fireEvent.click(quantFinCheckBox);
  expect(quantFinCheckBox.checked).toEqual(false);
});

test('Statistics checkbox works correctly', () => {
  const statCheckBox = screen.getByTestId('checkbox-Statistics');
  expect(statCheckBox.checked).toEqual(false);
  fireEvent.click(statCheckBox);
  expect(statCheckBox.checked).toEqual(true);
  fireEvent.click(statCheckBox);
  expect(statCheckBox.checked).toEqual(false);
});
