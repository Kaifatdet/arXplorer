import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import {
  render,
  fireEvent,
  screen,
  cleanup,
  queryByText,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Graph from '../Graph';
import { curveStepBefore } from 'd3';
import { mockData } from './mockData';

//getbytestid & provide svg testid: graph-svg to know if rendered
//need to create graph & expect nodes
//getbyquery & query circle
afterEach(cleanup);

const mockDimensions = { width: 1425, height: 714 };
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

  test('renders nodes', () => {
    const circle = document.querySelector('circle');
    fireEvent.click(circle); //vs user event
    //expect(screen.getByText).toBeTheDocument() after clicked on circle
    screen.debug();
  });
});

//unit tests for graph elements and drag helpers
//expect function to be output
//clickable or writable events
// const { getByTestId } = render(
//   <Graph dimensions={mockDimensions} graphData={mockData} />
//render Graph
//according to interface provide props
