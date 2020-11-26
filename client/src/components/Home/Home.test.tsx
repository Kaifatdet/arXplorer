'use strict';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import '@testing-library/jest-dom/extend-expect';

test('title renders correctly', () => {
  const { getByText } = render(<Home />);
  expect(getByText('Ready to arXplore?')).toBeInTheDocument();
});

test('displays images on front page', () => {
  render(<Home />, { wrapper: MemoryRouter});
  const imageElementSearch = screen.getByTestId('home-icon');
  const imageElementGraph = screen.getByTestId('graph-icon');
  const imageElementList = screen.getByTestId('list-icon');
  expect(imageElementSearch).toBeInTheDocument();
  expect(imageElementGraph).toBeInTheDocument();
  expect(imageElementList).toBeInTheDocument();
});

test('Text under search icon shows correctly', () => {
  const { getByText } = render(<Home />);
  expect(getByText('Search for your favorite authors')).toBeInTheDocument();
  expect(getByText('The search feature allows you to directly query the vast arXiv library for all the papers submitted by your favorite authors and their collaborators. Go to the search tab or enter an author below to get started.')).toBeInTheDocument();
});

test('Text under graph icon shows correctly', () => {
  const { getByText } = render(<Home />);
  expect(getByText('Explore with the interactive graph')).toBeInTheDocument();
  expect(getByText('The interactive graph makes it easy to explore and visualise author relations, articles and subject clusters. Simply traverse your way through the academic landscape by expanding or shrinking the graph!')).toBeInTheDocument();
});

test('Text under list icon shows correctly', () => {
  const { getByText } = render(<Home />);
  expect(getByText('Preview and filter articles in the list')).toBeInTheDocument();
  expect(getByText('While the graph is great for searching and visualising high level features, you sometimes want a closer look. No worries, I have you covered - just go to the list whenever you feel the urge for details.')).toBeInTheDocument();
});

test('Text above search shows correctly', () => {
  const { getByText } = render(<Home />);
  expect(getByText('Perform a quicksearch to get started on the graph:')).toBeInTheDocument();
});
