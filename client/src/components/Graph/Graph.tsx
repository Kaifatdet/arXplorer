import React, { useRef, useEffect, useState, FunctionComponent } from 'react';
import { select } from 'd3';
import { drawGraph } from './drawGraph';
import RightSidebar from '../RightSidebar';
import TinySearchBar from '../TinySearchBar';
import GraphErrorHandler from '../GraphErrorHandler';
import { Dictionary, Dimensions, GraphData, GraphNode } from '../../types';
import './Graph.css';

interface GraphProps {
  emptyGraph: boolean;
  dimensions: Dimensions;
  graphData: GraphData | null;
  handleGraphExpand: (author: string) => Promise<void>;
  authorDict: Dictionary;
  selectedAuthor: string;
  setSelectedAuthor: React.Dispatch<React.SetStateAction<string>>;
  setSelectedArticle: React.Dispatch<React.SetStateAction<string>>;
  removeSelectedAuthor: (author: string) => void;
  handleQuickSearch: (author: string) => void;
  killGraph: () => void;
  emptySearch: boolean;
  loading: boolean;
  tooLarge: boolean;
  setTooLarge: React.Dispatch<React.SetStateAction<boolean>>;
}

const Graph: FunctionComponent<GraphProps> = ({
  emptyGraph,
  dimensions,
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
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  // console.log(emptyGraph);
  useEffect(() => {
    if (!emptyGraph) {
      const svg = select<SVGSVGElement, GraphNode>(svgRef.current as any);
      drawGraph(svg, graphData as GraphData, dimensions, handleClick);
      graphData?.links;
    }
  }, [graphData, dimensions]);

  const handleClick = (author: string) => {
    setSelectedAuthor(author);
  };

  const handleExpandClick = () => {
    handleGraphExpand(selectedAuthor);
  };

  const handleClean = () => {
    killGraph();
    setTooLarge(false);
  };

  return (
    <div className="graph-container">
      <div className="data-container">
        {!emptyGraph && <svg ref={svgRef} className="graph-svg"></svg>}
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
      {graphData && Object.keys(graphData as GraphData).length > 0 && (
        <div className="graph-clean">
          <svg
            className="graph-icon-clean"
            viewBox="0 0 448 512"
            onClick={handleClean}
          >
            <defs>
              <linearGradient id="icon-red-gradient" x2="0.35" y2="1">
                <stop offset="0%" stopColor="var(--red-stop)" />
                <stop offset="30%" stopColor="var(--red-stop)" />
                <stop offset="100%" stopColor="var(--red-bot)" />
              </linearGradient>
            </defs>
            <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path>
          </svg>
          <h1 className="kill-text">Are you sure you want to clear graph?</h1>
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
};

export default Graph;
