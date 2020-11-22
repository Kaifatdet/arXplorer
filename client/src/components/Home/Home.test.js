'use strict';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import TinySearchBar from '../TinySearchBar';
import Home from './Home';

test('renders correctly', () => {
  render(<Home />);
  expect(screen.getByTestId('home')).toBeInTheDocument();
});
