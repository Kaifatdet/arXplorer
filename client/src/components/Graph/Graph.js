'use strict';

import React, { useRef, useEffect, useState } from 'react';
import './Graph.css';
import drawGraph from './drawGraph';
import { select } from 'd3';
import RightSidebar from '../RightSidebar';
import TinySearchBar from '../TinySearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import GraphErrorHandler from '../GraphErrorHandler';

function Graph({
  graphData,
  handleGraphExpand,
  authorDict,
  selectedAuthor,
  setSelectedAuthor,
  setSelectedArticle,
  removeSelectedAuthor,
  handleQuickSearch,
  killGraph,
  emptySearch,
  loading,
  tooLarge,
  setTooLarge,
}) {
  const [emptyGraph, setEmptyGraph] = useState(true);

  useEffect(() => {
    const svg = select(svgRef.current);

    drawGraph(svg, graphData, dimensions, handleClick, extractCategories);

    graphData.links && setEmptyGraph(false);
  }, [graphData]);

  const svgRef = useRef();
  const dimensions = {
    width: window.innerWidth,
    height: window.innerWidth / 2,
  };

  const handleClick = (author) => {
    setSelectedAuthor(author);
  };

  const handleExpandClick = () => {
    handleGraphExpand(selectedAuthor);
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
    setEmptyGraph(true);
    setTooLarge(false);
  };

  return (
    <div className="graph-container">
      <div className="data-container">
        <svg ref={svgRef} className="graph-svg"></svg>
      </div>
      <RightSidebar
        selectedAuthor={selectedAuthor}
        setSelectedAuthor={setSelectedAuthor}
        handleExpandClick={handleExpandClick}
        authorDict={authorDict}
        removeSelectedAuthor={removeSelectedAuthor}
        setSelectedArticle={setSelectedArticle}
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
      <GraphErrorHandler
        emptySearch={emptySearch}
        loading={loading}
        tooLarge={tooLarge}
        emptyGraph={emptyGraph}
      />
    </div>
  );
}

export default Graph;
