/* eslint-disable no-unused-vars */
import {
  select,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
  Selection,
  SimulationNodeDatum,
} from 'd3';
import {
  Dimensions,
  GraphCategory,
  GraphData,
  GraphLink,
  GraphNode,
} from '../../types';

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

type CallableDrag = (
  selection: Selection<SVGSVGElement, GraphNode, HTMLElement, unknown>,
  ...args: any[]
) => void;

const extractCategories = (data: GraphNode[]): GraphCategory[] => {
  const cats: GraphCategory[] = [];
  data.forEach((n) => {
    if (cats.filter((el) => el.name === n.cat_name).length === 0) {
      cats.push({
        name: n.cat_name,
        group: n.group,
      });
    }
  });
  return cats;
};

export const drawGraph = (
  svg: Selection<SVGSVGElement, GraphNode, HTMLElement, undefined>,
  data: GraphData,
  { width, height }: Dimensions,
  // eslint-disable-next-line no-unused-vars
  clickHandler: (author: string) => void
) => {
  svg.attr('viewBox', [0, 0, width, height].join(' ')).classed('viewBox', true);

  // Clears out the existing DOM-elements so the new graph won't override the graph and duplicate
  svg.selectAll('rect').remove();
  svg.selectAll('g').remove();

  const offsetX = 0;
  const offsetY = 0;

  svg
    .append('rect')
    .classed('bg', true)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('stroke', 'transparent')
    .attr('fill', 'transparent');

  svg.call((backgroundDrag(svg, offsetX, offsetY) as unknown) as CallableDrag);

  if (!data.nodes) return;
  const nodes: GraphNode[] = data.nodes.map((d) => Object.create(d));
  const links: GraphLink[] = data.links.map((d) => Object.create(d));
  const categories = extractCategories(nodes);

  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(links).id((d: SimulationNodeDatum) => (d as GraphNode).id)
    )
    .force('charge', forceManyBody())
    .force('collision', forceCollide())
    .force('center', forceCenter(width / 2, height / 2));

  const link = linkElement(svg, links);
  const node = nodeElement(svg, nodes, color).call(
    dragFunc(simulation) as any
  ) as any;
  const text = textElement(svg, nodes) as any;
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
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);

    node
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .on('click', function (d: any) {
        const author: string = d.target.__data__.id;
        clickHandler(author);
        // select(this).attr('fill', 'green');
      })
      .on('mouseover', (d: any) => {
        const index = d.target.__data__.index;
        select(text._groups[0][index]).attr('visibility', 'visible');
      })
      .on('mouseout', (d: any) => {
        const index = d.target.__data__.index;
        select(text._groups[0][index]).attr('visibility', 'hidden');
      });

    text
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y - Math.sqrt(d.weight) - 15);

    categoryLegendCircle
      .attr('cx', -width * 0.05)
      // .attr('cy', (d) => height - d.group * 40);
      .attr('cy', (d) => height - d.group * 0.05 * height);
    categoryLegendText
      .attr('x', -width * 0.05 + 25)
      .attr('y', (d) => height - d.group * 0.05 * height + 3);

    sizeLegendCircle
      .attr('cx', (d) => width * 0.38 + d.id * width * 0.12)
      .attr('cy', height - height * 0.05);
    sizeLegendText
      .attr(
        'x',
        (d: any) =>
          width * 0.38 + d.id * width * 0.12 + Math.sqrt(d.weight) + 15
      )
      .attr('y', height - height * 0.05 + 5);
  });
};
