'use strict';

import React, { useRef, useEffect } from 'react';
import drawGraph from './drawGraph';
import { select } from 'd3';

// eslint-disable-next-line react/prop-types
function Graph({ data }) {
  const svgRef = useRef();
  const svg = select(svgRef.current);
  const dimensions = {
    height: 600,
    width: 800,
  };
  useEffect(() => {
    drawGraph(svg, data, dimensions);
  }, [data]);

  return (
    <div className="data-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default Graph;
