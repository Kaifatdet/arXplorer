/* eslint-disable no-undef */
import React from 'react';
import Navbar from './Navbar';
import {
  render,
  screen,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

beforeEach(() => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <Navbar />
    </Router>
  );
});

test('Home link is shown', () => {
  expect(screen.getByText('Home')).toBeInTheDocument();
});

test('Search link is shown', () => {
  expect(screen.getByText('Search')).toBeInTheDocument();
});

test('Graph link is shown', () => {
  expect(screen.getByText('Graph')).toBeInTheDocument();
});

test('List link is shown', () => {
  expect(screen.getByText('List')).toBeInTheDocument();
});
