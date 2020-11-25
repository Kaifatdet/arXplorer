import {
  getByTestId,
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import App from './App';
import Navbar from './components/Navbar';

import { createMemoryHistory, location } from 'history';

import React from 'react';
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { fetchGraphDataMock } from './mocks/fetchGraphDataMock';

let history;
beforeEach(() => {
  history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );
});

test('displays front page title and search bar', () => {
  const headingElement = screen.getByText('Ready to arXplore?');
  expect(headingElement).toBeInTheDocument();
  expect(screen.getByTestId('tiny-search-bar')).toBeInTheDocument();
});

// test('Navbar renders correctly', () => {
//   render(<Navbar />);
//   expect(screen.getByTestId('navbar').toBeInTheDocument());
// });

test('loads search page upon click', async () => {
  fireEvent.click(screen.getByText('Search'));
  // Wait for page to update with query text
  const items = await screen.findAllByText('Author');
  expect(items).toHaveLength(1);
});

test('searches correctly', async () => {
  // const fetchGraphData = jest.fn();
  // fetchGraphData.mockResolvedValue(fetchGraphDataMock);

  const data = fetchGraphDataMock;
  const mockFn = jest.fn().mockResolvedValue(data);
  2;
  jest.mock('./services/ApiClient', () => {
    return {
      __esModule: true,
      fetchGraphData: mockFn,
    };
  });

  const searchInput = screen.getByPlaceholderText('Search for author...');
  const button = screen.getByText('Quicksearch');
  const listbutton = screen.getByTestId('listbutton');

  fireEvent.change(searchInput, { target: { value: 'Trump' } });
  fireEvent.click(button);

  waitFor(document.querySelector('circle'), () => {
    expect(history.location.pathname).toBe('/graph');
    fireEvent.click(listbutton);
    expect(history.location.pathname).toBe('/list');
    screen.getByText('Total # of articles: 25');
  });

  // expect(fetchGraphData).toBeCalled();
});
