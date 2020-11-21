import {
  fireEvent,
  getByLabelText,
  queryAllByPlaceholderText,
  render,
  screen,
} from '@testing-library/react';
import TinySearchBar from './TinySearchBar';
import React from 'react';
import { interpolate } from 'd3';

// test('displays ');

it('renders correctly', () => {
  const { queryByTestId, queryByPlaceholderText } = render(<TinySearchBar />);
  expect(queryByTestId('tiny-search-button')).toBeTruthy();
  expect(queryByPlaceholderText('Search for author...')).toBeTruthy();
});

describe('Input value', () => {
  it('updates on change', () => {
    const { queryByPlaceholderText } = render(<TinySearchBar />);
    const searchInput = queryByPlaceholderText('Search for author...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput.value).toBe('test');
  });
});
