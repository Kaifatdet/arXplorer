'use strict';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import TinySearchBar from '../TinySearchBar';
import Home from './Home';
import '@testing-library/jest-dom/extend-expect';

test('title renders correctly', () => {
  const { getByText } = render(<Home />);
  expect(getByText('Ready to arXplore?')).toBeInTheDocument();
});
