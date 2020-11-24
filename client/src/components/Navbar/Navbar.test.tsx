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

test('Navbar renders correctly', () => {
  // const history = createMemoryHistory();
  // render(
  //   <Router history={history}>
  //     <Navbar />
  //   </Router>
  // );
  // expect(screen.getByTestId('navbar')).toBeInTheDocument();
});

// test('loads search page upon click', async () => {
//   // const history = createMemoryHistory();

//   // Click button
//   fireEvent.click(screen.getByText('Search'));
//   // Wait for page to update with query text
//   const items = await screen.findByText('Author');
//   expect(items).toHaveLength(1);
// });
