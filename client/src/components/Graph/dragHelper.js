'use strict';

import { drag, scaleOrdinal, schemePaired } from 'd3';

export const dragFunc = (simulation) => {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.5).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  return drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
};

export const backgroundDrag = (selection, offsetX, offsetY) => {
  function dragstarted() {
    return undefined;
  }

  function dragged(e) {
    offsetX -= e.dx;
    offsetY -= e.dy;
    selection
      .selectAll('g.nodes')
      .attr('transform', `translate(${-offsetX}, ${-offsetY})`);
  }

  function dragended() {
    return undefined;
  }

  return drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
};

export const color = () => {
  const scale = scaleOrdinal(schemePaired);
  return (d) => scale(d.group);
};
