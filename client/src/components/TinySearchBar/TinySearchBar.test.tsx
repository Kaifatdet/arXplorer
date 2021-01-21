/* eslint-disable no-undef */
import { fireEvent, render } from '@testing-library/react';
import TinySearchBar from './TinySearchBar';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

test('TinySearchBar renders correctly', () => {
  const handleQuickSearch = jest.fn();
  const { getByLabelText, getByPlaceholderText } = render(
    <TinySearchBar handleQuickSearch={handleQuickSearch} />
  );
  getByLabelText('Quick Search');
  getByPlaceholderText('Search for author...');
});

test('updates on change', () => {
  const { getByPlaceholderText } = render(<TinySearchBar />);
  const searchInput = getByPlaceholderText('Search for author...');
  fireEvent.change(searchInput, { target: { value: 'test' } });
  expect(searchInput.value).toBe('test');
});

test('invokes handleQuickSearch', () => {
  const handleQuickSearch = jest.fn();
  const { getByText, getByPlaceholderText } = render(
    <TinySearchBar handleQuickSearch={handleQuickSearch} />,
    { wrapper: MemoryRouter }
  );
  const button = getByText('Quicksearch');
  const searchInput = getByPlaceholderText('Search for author...');
  fireEvent.click(button);
  expect(handleQuickSearch).not.toBeCalled();

  fireEvent.change(searchInput, { target: { value: 'test' } });

  fireEvent.click(button);
  expect(handleQuickSearch).toBeCalled();
});
