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

//getbytestid & provide svg testid: graph-svg to know if rendered
//need to create graph & expect nodes
//getbyquery & query circle
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
    screen.debug();
  });

  test('renders articles upon node click', () => {
    //   expect(screen.queryAllByText('Expand graph')).not.toBeInTheDocument();
    const circle = document.querySelector('circle');
    fireEvent.click(circle); //vs user event

    // screen.getByRole('button');
    expect(screen.getByText('show details')).toBeInTheDocument();
    // expect(screen.getByText('show details')).toBeInTheDocument();
    screen.debug();
  });

  test('renders subject legend', () => {
    expect(
      screen.getByText('High Energy Physics - Phenomenology')
    ).toBeInTheDocument();
    screen.debug();
  });
  test('renders collaborator legend', () => {
    expect(screen.getByText('1 collaborator')).toBeInTheDocument();
    screen.debug();
  });
});
