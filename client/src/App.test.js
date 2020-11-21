import {
  getByTestId,
  fireEvent,
  getByText,
  render,
  screen,
} from '@testing-library/react';
import App from './App';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

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
// describe('test text finding', () => {

// });

test('loads search page upon click', async () => {
  fireEvent.click(screen.getByText('Search'));
  // Wait for page to update with query text
  const items = await screen.findAllByText('Author');
  expect(items).toHaveLength(1);
});

// describe('test click', () => {

// });

// test('something else example test.... blah', () => {

// }

// fireEvent(
//   getByText(container, 'Submit'),
//   new MouseEvent('click', {
//     bubbles: true,
//     cancelable: true,
//   })
// )
