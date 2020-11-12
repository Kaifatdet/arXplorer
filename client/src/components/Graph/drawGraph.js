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

const drawGraph = (svg, data, { width, height }, clickHandler) => {
  svg.attr('viewBox', [0, 0, width, height]).classed('viewBox', true);

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

  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(links).id((d) => d.id)
    )
    .force('charge', forceManyBody())
    .force('center', forceCenter(width / 2, height / 2));

  const link = svg
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', (d) => Math.sqrt(d.value))
    .attr('stroke', '#3333')
    .attr('stroke-opacity', 0.6);

  const node = svg
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', (d) => Math.max(Math.sqrt(d.weight), 6))
    // .attr('r', 6)
    .attr('fill', color())
    .attr('stroke', '#000')
    .attr('stroke-width', 0.5)
    .call(dragFunc(simulation));

  const text = svg
    .selectAll('.label')
    .data(nodes)
    .join('text')
    .attr('class', 'label')
    .attr('text-anchor', 'middle')
    .attr('font-size', 6)
    .attr('visibility', 'hidden')
    .text((d) => d.id);

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
  });
};

export default drawGraph;
