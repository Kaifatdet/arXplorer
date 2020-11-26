import React from 'react';
import Navbar from './Navbar';
import {
  render,
  screen,
  getByTestId,
  getByText,
  fireEvent,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, NavLink } from 'react-router-dom';
import App from '../../App';
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

test('loads search page upon click', async () => {
  // const history = createMemoryHistory();
  // Click button
  // fireEvent.click(screen.getByText('Search'));
  // Wait for page to update with query text
  // const items = await screen.findByText('Author');
  // console.log(items);
});
