export const linkElement = (selection, data) => {
  return selection
    .append('g')
    .classed('nodes', true)
    .selectAll('line')
    .data(data)
    .join('line')
    .attr('stroke-width', 1)
    .attr('stroke', '#3333')
    .attr('stroke-opacity', 0.6);
};

export const nodeElement = (selection, data, cb) => {
  return selection
    .append('g')
    .classed('nodes', true)
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('r', (d) => Math.sqrt(d.weight) * 3)
    .attr('fill', cb())
    .attr('stroke', '#000')
    .attr('stroke-width', 0.3);
};

export const textElement = (selection, data) => {
  return selection
    .append('g')
    .classed('nodes', true)
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('class', 'label')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('visibility', 'hidden')
    .text((d) => d.id);
};

export const categoryLegendCircleElement = (selection, data, cb) => {
  return selection
    .append('g')
    .classed('legend', true)
    .selectAll('legend-circle')
    .data(data)
    .join('circle')
    .attr('r', 10)
    .attr('stroke', '#000')
    .attr('stroke-width', 0.3)
    .attr('fill', cb());
};

export const categoryLegendTextElement = (selection, data) => {
  return selection
    .append('g')
    .classed('legend', true)
    .selectAll('legend-text')
    .data(data)
    .join('text')
    .attr('class', 'legend-label')
    .attr('font-size', 12)
    .text((d) => d.name);
};

export const sizeLegendCircleElement = (selection, data) => {
  return selection
    .append('g')
    .classed('legend', true)
    .selectAll('legend-circle')
    .data(data)
    .join('circle')
    .attr('r', (d) => Math.sqrt(d.weight) * 3)
    .attr('stroke', '#000')
    .attr('stroke-width', 0.3)
    .attr('fill', '#a6cee3');
};

export const sizeLegendTextElement = (selection, data) => {
  return selection
    .append('g')
    .classed('legend', true)
    .selectAll('legend-text')
    .data(data)
    .join('text')
    .attr('class', 'legend-label')
    .attr('font-size', 12)
    .text((d) => d.legend);
};
