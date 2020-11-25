import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import {
  render,
  fireEvent,
  screen,
  cleanup,
  queryByText,
  getByTestId,
  waitFor,
} from '@testing-library/react';
import Graph from '../Graph';
import { mockData } from './mockData';

afterEach(cleanup);

const mockDimensions = { width: 1428, height: 714 };

describe('Graph', () => {
  beforeEach(() => {
    render(
      <Graph
        dimensions={mockDimensions}
        graphData={mockData}
        emptyGraph={false}
      />
    );
  });
  test('renders Graph component', () => {
    expect(screen.getByTestId('graph-svg')).toBeInTheDocument();
  });

  test('renders articles upon node click', () => {
    const circle = document.querySelector('circle');
    fireEvent.click(circle);

    expect(screen.getByText('show details')).toBeInTheDocument();
  });

  test('renders subject legend', () => {
    expect(
      screen.getByText('High Energy Physics - Phenomenology')
    ).toBeInTheDocument();
  });
  test('renders collaborator legend', () => {
    expect(screen.getByText('1 collaborator')).toBeInTheDocument();
  });
});
