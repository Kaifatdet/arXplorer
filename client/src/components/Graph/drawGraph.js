'use strict';

import {
  select,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  drag,
} from 'd3';
import { dragFunc, color } from './dragHelper';

const drawGraph = (
  svg,
  data,
  { width, height },
  clickHandler,
  extractCategories
) => {
  svg.attr('viewBox', [0, 0, width, height]).classed('viewBox', true);

  svg.selectAll('g').remove();

  let offsetX = 0;
  let offsetY = 0;

  const backgroundDrag = drag()
    .on('start', () => undefined)
    .on('drag', (e) => {
      offsetX -= e.dx;
      offsetY -= e.dy;
      svg.attr('viewBox', [
        0 + offsetX,
        0 + offsetY,
        width + offsetX,
        height + offsetY,
      ]);
    })
    .on('end', () => undefined);

  svg.call(backgroundDrag);

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
    .force('center', forceCenter(width / 2, height / 2));

  const link = svg
    .append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', 1)
    .attr('stroke', '#3333')
    .attr('stroke-opacity', 0.6);

  const node = svg
    .append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', (d) => Math.sqrt(d.weight) * 3)
    .attr('fill', color())
    .attr('stroke', '#000')
    .attr('stroke-width', 0.5)
    .call(dragFunc(simulation));

  const text = svg
    .append('g')
    .selectAll('.g')
    .data(nodes)
    .join('text')
    .attr('class', 'label')
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
    .attr('visibility', 'hidden')
    .text((d) => d.id);

  const legend_circle = svg
    .selectAll('legend-circle')
    .data(categories)
    .join('circle')
    .attr('r', 10)
    .attr('fill', color());

  const legend_text = svg
    .append('g')
    .selectAll('g')
    .data(categories)
    .join('text')
    .attr('class', 'legend-label')
    .attr('font-size', 10)
    .text((d) => d.name);

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

    text.attr('x', (d) => d.x).attr('y', (d) => d.y - 10);

    legend_circle.attr('cx', 0).attr('cy', (d) => height - d.group * 30);
    legend_text.attr('x', 15).attr('y', (d) => height - d.group * 30 + 2);
  });
};

export default drawGraph;
