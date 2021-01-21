import { Selection } from 'd3';
import { GraphCategory, GraphLegend, GraphLink, GraphNode } from '../../types';

export const linkElement = (
  selection: Selection<SVGSVGElement, GraphNode, HTMLElement, undefined>,
  data: GraphLink[]
) => {
  return selection
    .append('g')
    .classed('nodes', true)
    .selectAll('line')
    .data(data)
    .join('line')
    .attr('stroke-width', 1)
    .attr('stroke', '#707070')
    .attr('stroke-opacity', 0.6);
};

export const nodeElement = (
  selection: Selection<SVGSVGElement, GraphNode, HTMLElement, undefined>,
  data: GraphNode[],
  cb: any
) => {
  return selection
    .append('g')
    .classed('nodes', true)
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('r', (d) => Math.min(Math.max(Math.sqrt(d.weight) * 2, 5), 20))
    .attr('fill', cb())
    .attr('stroke', 'black')
    .attr('stroke-width', 0.3);
};

export const textElement = (
  selection: Selection<SVGSVGElement, GraphNode, HTMLElement, undefined>,
  data: GraphNode[]
) => {
  return selection
    .append('g')
    .classed('nodes', true)
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('class', 'label')
    .attr('text-anchor', 'middle')
    .attr('font-size', '1.8rem')
    .attr('visibility', 'hidden')
    .style('fill', 'whitesmoke')
    .text((d) => d.id);
};

export const categoryLegendCircleElement = (
  selection: Selection<SVGSVGElement, GraphNode, HTMLElement, undefined>,
  data: GraphCategory[],
  cb: () => (d: any) => string
) => {
  return selection
    .append('g')
    .classed('legend', true)
    .selectAll('legend-circle')
    .data(data)
    .join('circle')
    .attr('r', '1rem')
    .attr('stroke', '#000')
    .attr('stroke-width', 0.3)
    .attr('fill', cb());
};

export const categoryLegendTextElement = (
  selection: Selection<SVGSVGElement, GraphNode, HTMLElement, undefined>,
  data: GraphCategory[]
) => {
  return selection
    .append('g')
    .classed('legend', true)
    .selectAll('legend-text')
    .data(data)
    .join('text')
    .attr('class', 'legend-label')
    .attr('font-size', '1.2rem')
    .style('fill', 'whitesmoke')
    .text((d) => d.name);
};

export const sizeLegendCircleElement = (
  selection: Selection<SVGSVGElement, GraphNode, HTMLElement, undefined>,
  data: GraphLegend[]
) => {
  return selection
    .append('g')
    .classed('legend', true)
    .selectAll('legend-circle')
    .data(data)
    .join('circle')
    .attr('r', (d) => Math.min(Math.max(Math.sqrt(d.weight) * 2, 5), 20))
    .attr('stroke', '#000')
    .attr('stroke-width', 0.3)
    .attr('fill', '#a6cee3');
};

export const sizeLegendTextElement = (
  selection: Selection<SVGSVGElement, GraphNode, HTMLElement, undefined>,
  data: GraphLegend[]
) => {
  return (selection as any)
    .append('g')
    .classed('legend', true)
    .selectAll('legend-text')
    .data(data)
    .join('text')
    .attr('class', 'legend-label')
    .attr('font-size', '1.2rem')
    .style('fill', 'whitesmoke')
    .text((d: any) => d.legend);
};
