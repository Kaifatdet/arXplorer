import * as d3 from 'd3';
import { dragFunc } from '../dragHelper';
import { mockData } from '../__test__/mockData';

const node = mockData.nodes;

describe('drag', () => {
  jest.mock('d3', () => {
    const wrappedD3 = jest.requireActual('d3');

    const d3Mock = {
      drag: undefined,
      event: wrappedD3.event,
      select: wrappedD3.select,
      __passedEventHandlers: [],
    };

    d3Mock.drag = () => {
      const dragMock = {
        apply: () => {},
      };
      dragMock.on = (event, eventHandler) => {
        d3Mock.__passedEventHandlers.push(eventHandler);
        return dragMock;
      };
      return dragMock;
    };

    return d3Mock;
  });

  test('enableDragAndDrop', () => {
    const element = document.createElement('svg');
    document.body.appendChild(element);

    const svgSelection = d3.select(element);

    dragStarted.enableDragAndDrop(svgSelection);

    spyOn(node, 'dragFunc');
    const dragStartedHandler = d3.__passedEventHandlers[0];
    dragStartedHandler();
    expect(node.dragFunc).toHaveBeenCalled();
  });
});
