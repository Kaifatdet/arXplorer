'use strict';

import React, { useRef, useEffect } from 'react';
import './Graph.css';
import drawGraph from './drawGraph';
import { select } from 'd3';
import RightSidebar from '../RightSidebar';
import TinySearchBar from '../TinySearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Graph({
  graphData,
  handleGraphExpand,
  authorDict,
  selectedAuthor,
  selectAuthor,
  resetSelectedAuthor,
  handleSidebarAuthorRedirect,
  removeSelectedAuthor,
  handleQuickSearch,
  killGraph,
}) {
  useEffect(() => {
    const svg = select(svgRef.current);
    drawGraph(svg, graphData, dimensions, handleClick, extractCategories);
  }, [graphData]);

  const svgRef = useRef();
  const dimensions = {
    width: window.innerWidth,
    height: window.innerWidth / 2,
  };

  const handleClick = (author) => {
    selectAuthor(author);
  };

  const handleExpandClick = () => {
    handleGraphExpand(selectedAuthor);
  };

  const toggleSelected = () => {
    resetSelectedAuthor();
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

  const handleClean = () => {
    killGraph();
  };

  return (
    <div className="graph-container">
      <div className="data-container">
        <svg ref={svgRef}></svg>
      </div>
      <RightSidebar
        selectedAuthor={selectedAuthor}
        handleExpandClick={handleExpandClick}
        authorDict={authorDict}
        toggleSelected={toggleSelected}
        handleSidebarAuthorRedirect={handleSidebarAuthorRedirect}
        resetSelectedAuthor={resetSelectedAuthor}
        removeSelectedAuthor={removeSelectedAuthor}
      />
      <TinySearchBar handleQuickSearch={handleQuickSearch} />
      {Object.keys(graphData).length > 0 && (
        <div className="graph-clean">
          <FontAwesomeIcon
            icon={faTrashAlt}
            className="graph-icon-clean"
            onClick={handleClean}
          />
          <p className="kill-text">Are you sure you want to clear graph?</p>
        </div>
      )}
    </div>
  );
}

export default Graph;
