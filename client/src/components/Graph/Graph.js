'use strict';

import React, { useRef, useEffect } from 'react';
import './Graph.css';
import drawGraph from './drawGraph';
import { select } from 'd3';
import RightSidebar from '../RightSidebar';
import TinySearchBar from '../TinySearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../styleComponents/LoadingSpinner';

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
}) {
  useEffect(() => {
    const svg = select(svgRef.current);
    graphData.links &&
      graphData.links.length < 1000 &&
      drawGraph(svg, graphData, dimensions, handleClick, extractCategories);
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
      {emptySearch && (
        <div className="empty-search-msg">
          <p className="error-msg">
            No search luck, try again with another name!
          </p>
        </div>
      )}
      {!graphData.nodes && (
        <div className="graph-empty-placeholder">
          <div className="empty-message">
            There is currently no articles to show on the graph - please go to
            the{' '}
            <Link to="/search" id="search-redirect-link">
              search
            </Link>{' '}
            page or use the quicksearch below.
          </div>
        </div>
      )}
      {loading && (
        <div className="graph-loading-widget">
          <LoadingSpinner />
        </div>
      )}
      {graphData.nodes && graphData.links.length > 1000 && (
        <div className="graph-too-large">
          <h3 className="too-large-msg">
            Graph is too large after latest search. Please shrink/clear the
            graph or specify your search further
          </h3>
        </div>
      )}
      ;
    </div>
  );
}

export default Graph;
