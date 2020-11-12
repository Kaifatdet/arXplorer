'use strict';

import React, { useRef, useEffect, useState } from 'react';
import './Graph.css';
import drawGraph from './drawGraph';
import { select } from 'd3';
import RightSidebar from '../RightSidebar';

function Graph({ graphData, handleGraphExpand }) {
  const [selected, setSelected] = useState('');
  const svgRef = useRef();
  const dimensions = {
    height: 600,
    width: 800,
  };

  const handleClick = (input) => {
    setSelected(input);
  };

  const handleExpandClick = () => {
    handleGraphExpand(selected);
  };

  useEffect(() => {
    const svg = select(svgRef.current);
    drawGraph(svg, graphData, dimensions, handleClick);
  }, [graphData]);

  return (
    <>
      <div className="data-container">
        <svg ref={svgRef}></svg>
      </div>
      <RightSidebar selected={selected} handleExpandClick={handleExpandClick} />
    </>
  );
}

export default Graph;
