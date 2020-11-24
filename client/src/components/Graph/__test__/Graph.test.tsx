import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Graph from '../Graph';
test('renders learn react link', () => {
  const { getByText } = render(<App />, { wrapper: MemoryRouter });
  expect(getByText('Ready to arXplore?')).toBeInTheDocument();
});

//getbytestid & provide svg testid: graph-svg to know if rendered
//need to create graph & expect nodes
//getbyquery & query circle

test('renders graph', () => {
  render(<Graph />);
  getByTestId('graph-svg');
  //   const data = [];

  //render Graph
  //according to interface provide props
});

//fireEvent.click('circle') - to se if you have nodes
//legend
