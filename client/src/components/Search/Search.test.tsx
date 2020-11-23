import { useHistory } from 'react-router-dom';
import { subjects } from '../../services/categories';
import LoadingSpinner from '../../styleComponents/LoadingSpinner.js';

import { render, screen } from '@testing-library/react';
import React from 'react';
import TinySearchBar from '../TinySearchBar';
import Search from './Search';

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
