'use strict';

import {
  select,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
} from 'd3';
import { dragFunc, color, backgroundDrag } from './dragHelper';
import {
  linkElement,
  nodeElement,
  textElement,
  categoryLegendCircleElement,
  categoryLegendTextElement,
  sizeLegendCircleElement,
  sizeLegendTextElement,
} from './graphElements';

const drawGraph = (
  svg,
  data,
  { width, height },
  clickHandler,
  extractCategories
) => {
  svg.attr('viewBox', [0, 0, width, height]).classed('viewBox', true);

  // Clears out the existing DOM-elements so the new graph won't override the graph and duplicate
  svg.selectAll('rect').remove();
  svg.selectAll('g').remove();

  let offsetX = 0;
  let offsetY = 0;

  svg
    .append('rect')
    .classed('bg', true)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('stroke', 'transparent')
    .attr('fill', 'transparent');

  svg.call(backgroundDrag(svg, offsetX, offsetY));

  if (!data.nodes) return;
  const nodes = data.nodes.map((d) => Object.create(d));
  const links = data.links.map((d) => Object.create(d));
  const categories = extractCategories(nodes);

  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(links).id((d) => d.id)
    )
    .force('charge', forceManyBody())
    .force('collision', forceCollide())
    .force('center', forceCenter(width / 2, height / 2));

  const link = linkElement(svg, links);
  const node = nodeElement(svg, nodes, color).call(dragFunc(simulation));
  const text = textElement(svg, nodes);
  const categoryLegendCircle = categoryLegendCircleElement(
    svg,
    categories,
    color
  );
  const categoryLegendText = categoryLegendTextElement(svg, categories);
  const sizeLegendCircle = sizeLegendCircleElement(svg, [
    { id: 0, weight: 1 },
    { id: 1, weight: 10 },
    { id: 2, weight: 25 },
  ]);
  const sizeLegendText = sizeLegendTextElement(svg, [
    { id: 0, weight: 1, legend: '1 collaborator' },
    { id: 1, weight: 10, legend: '10 collaborators' },
    { id: 2, weight: 25, legend: '25 collaborators' },
  ]);

  simulation.on('tick', () => {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .on('click', function (d) {
        clickHandler(d.target.__data__.id);
        // select(this).attr('fill', 'green');
      })
      .on('mouseover', function (d) {
        const index = d.target.__data__.index;
        select(text._groups[0][index]).attr('visibility', 'visible');
      })
      .on('mouseout', function (d) {
        const index = d.target.__data__.index;
        select(text._groups[0][index]).attr('visibility', 'hidden');
      });

    text.attr('x', (d) => d.x).attr('y', (d) => d.y - Math.sqrt(d.weight) - 15);

    categoryLegendCircle
      .attr('cx', -width * 0.05)
      .attr('cy', (d) => height - d.group * 30);
    categoryLegendText
      .attr('x', -width * 0.05 + 15)
      .attr('y', (d) => height - d.group * 30 + 5);

    sizeLegendCircle
      .attr('cx', (d) => width * 0.38 + d.id * width * 0.12)
      .attr('cy', height - height * 0.05);
    sizeLegendText
      .attr(
        'x',
        (d) => width * 0.38 + d.id * width * 0.12 + Math.sqrt(d.weight) + 15
      )
      .attr('y', height - height * 0.05 + 5);
  });
};

export default drawGraph;
