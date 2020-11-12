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
    width: 1280,
  };

  const handleClick = (input) => {
    setSelected(input);
  };

  const handleExpandClick = () => {
    handleGraphExpand(selected);
  };

  const extractCategories = (data) => {
    let cats = [];
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

  useEffect(() => {
    const svg = select(svgRef.current);
    drawGraph(svg, graphData, dimensions, handleClick, extractCategories);
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
