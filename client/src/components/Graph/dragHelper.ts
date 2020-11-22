import {
  D3DragEvent,
  drag,
  scaleOrdinal,
  schemePaired,
  Simulation,
  Selection,
} from 'd3';
import { GraphNode } from '../../types';

export const dragFunc = (simulation: Simulation<GraphNode, undefined>) => {
  function dragStarted(
    event: D3DragEvent<SVGSVGElement, GraphNode, GraphNode>
  ) {
    if (!event.active) simulation.alphaTarget(0.5).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: D3DragEvent<SVGSVGElement, GraphNode, GraphNode>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragEnded(event: D3DragEvent<SVGSVGElement, GraphNode, GraphNode>) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  return drag()
    .on('start', dragStarted)
    .on('drag', dragged)
    .on('end', dragEnded);
};

export const backgroundDrag = (
  selection: Selection<SVGSVGElement, GraphNode, HTMLElement, undefined>,
  offsetX: number,
  offsetY: number
) => {
  function dragStarted() {
    return undefined;
  }

  function dragged(e: D3DragEvent<SVGSVGElement, GraphNode, GraphNode>) {
    offsetX -= e.dx;
    offsetY -= e.dy;
    selection
      .selectAll('g.nodes')
      .attr('transform', `translate(${-offsetX}, ${-offsetY})`);
  }

  function dragEnded() {
    return undefined;
  }

  return drag()
    .on('start', dragStarted)
    .on('drag', dragged)
    .on('end', dragEnded);
};

export const color = () => {
  const scale = scaleOrdinal(schemePaired);
  return (d: any) => scale(d.group);
};
