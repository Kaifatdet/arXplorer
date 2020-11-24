import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
test('renders learn react link', () => {
  const { getByText } = render(<App />, { wrapper: MemoryRouter });
  expect(getByText('Ready to arXplore?')).toBeInTheDocument();
});
