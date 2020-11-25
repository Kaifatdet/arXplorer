/* eslint-disable no-undef */
import {
  getByTestId,
  fireEvent,
  getByText,
  render,
  screen,
} from '@testing-library/react';
import App from './App';
import Navbar from './components/Navbar';

import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

beforeEach(() => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <App />
    </Router>
  );
});

test('displays front page title', () => {
  const headingElement = screen.getByText('Ready to arXplore?');
  expect(headingElement).toBeInTheDocument();
  expect(screen.getByTestId('tiny-search-bar')).toBeInTheDocument();
});

// test('Navbar renders correctly', () => {
//   render(<Navbar />);
//   expect(screen.getByTestId('navbar'));
// });

test('loads search page upon click', async () => {
  fireEvent.click(screen.getByText('Search'));
  // Wait for page to update with query text
  const author = await screen.getByLabelText('Author');
  const title = await screen.getByLabelText('Title');
  const journal = await screen.getByLabelText('Journal');
  const abstract = await screen.getByLabelText('Abstract');
  expect(author).toBeInTheDocument();
  expect(title).toBeInTheDocument();
  expect(journal).toBeInTheDocument();
  expect(abstract).toBeInTheDocument();
});
