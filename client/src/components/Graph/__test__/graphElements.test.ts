import '@testing-library/jest-dom/extend-expect';
import {
  linkElement,
  textElement,
  categoryLegendCircleElement,
  categoryLegendTextElement,
  sizeLegendCircleElement,
  sizeLegendTextElement,
} from '../graphElements';

describe('graphElement', () => {
  let selection;
  beforeEach(() => {
    selection = {
      append: jest.fn().mockReturnThis(),
      classed: jest.fn().mockReturnThis(),
      selectAll: jest.fn().mockReturnThis(),
      data: jest.fn().mockReturnThis(),
      join: jest.fn().mockReturnThis(),
      attr: jest.fn().mockReturnThis(),
      style: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
    };
  });

  test('linkElement', () => {
    linkElement(selection, []);
    expect(selection.append).toBeCalled();
    expect(selection.classed).toBeCalled();
    expect(selection.selectAll).toBeCalled();
    expect(selection.data).toBeCalled();
    expect(selection.join).toBeCalled();
    expect(selection.attr).toHaveBeenCalledTimes(3);
  });

  test('textElement', () => {
    textElement(selection, []);
    expect(selection.append).toBeCalled();
    expect(selection.classed).toBeCalled();
    expect(selection.selectAll).toBeCalled();
    expect(selection.data).toBeCalled();
    expect(selection.join).toBeCalled();
    expect(selection.attr).toHaveBeenCalledTimes(4);
    expect(selection.text).toBeCalled();
    expect(selection.style).toBeCalled();
  });

  test('categoryLegendCircleElement', () => {
    textElement(selection, []);
    expect(selection.append).toBeCalled();
    expect(selection.classed).toBeCalled();
    expect(selection.selectAll).toBeCalled();
    expect(selection.data).toBeCalled();
    expect(selection.join).toBeCalled();
    expect(selection.attr).toHaveBeenCalledTimes(4);
  });

  test('categoryLegendCircleElement', () => {
    categoryLegendCircleElement(selection, [], jest.fn());
    expect(selection.append).toBeCalled();
    expect(selection.classed).toBeCalled();
    expect(selection.selectAll).toBeCalled();
    expect(selection.data).toBeCalled();
    expect(selection.join).toBeCalled();
    expect(selection.attr).toHaveBeenCalledTimes(4);
  });

  test('categoryLegendTextElement', () => {
    categoryLegendTextElement(selection, [], jest.fn());
    expect(selection.append).toBeCalled();
    expect(selection.classed).toBeCalled();
    expect(selection.selectAll).toBeCalled();
    expect(selection.data).toBeCalled();
    expect(selection.join).toBeCalled();
    expect(selection.text).toBeCalled();
    expect(selection.style).toBeCalled();
    expect(selection.attr).toHaveBeenCalledTimes(2);
  });
  test('sizeLegendCircleElement', () => {
    sizeLegendCircleElement(selection, [], jest.fn());
    expect(selection.append).toBeCalled();
    expect(selection.classed).toBeCalled();
    expect(selection.selectAll).toBeCalled();
    expect(selection.data).toBeCalled();
    expect(selection.join).toBeCalled();
    expect(selection.attr).toHaveBeenCalledTimes(4);
  });
  test('sizeLegendTextElement', () => {
    sizeLegendTextElement(selection, []);
    expect(selection.append).toBeCalled();
    expect(selection.classed).toBeCalled();
    expect(selection.selectAll).toBeCalled();
    expect(selection.data).toBeCalled();
    expect(selection.join).toBeCalled();
    expect(selection.text).toBeCalled();
    expect(selection.style).toBeCalled();
    expect(selection.attr).toHaveBeenCalledTimes(2);
  });
});
