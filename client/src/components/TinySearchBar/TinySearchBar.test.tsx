import { fireEvent, render } from '@testing-library/react';
import TinySearchBar from './TinySearchBar';
import React from 'react';
// import { interpolate } from 'd3';

// test('displays ');

test('renders correctly', () => {
  const { getByLabelText, getByPlaceholderText } = render(<TinySearchBar />);
  getByLabelText('Quick Search');
  getByPlaceholderText('Search for author...');
});

test('updates on change', () => {
  const { getByPlaceholderText } = render(<TinySearchBar />);
  const searchInput = getByPlaceholderText('Search for author...');
  fireEvent.change(searchInput, { target: { value: 'test' } });
  expect(searchInput.value).toBe('test');
});
