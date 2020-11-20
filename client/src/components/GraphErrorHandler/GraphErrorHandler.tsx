import React from 'react';
import './GraphErrorHandler.css';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../styleComponents/LoadingSpinner';

type GraphErrorHandlerProps = {
  emptySearch: any;
  loading: any;
  tooLarge: any;
  emptyGraph: any;
};

const GraphErrorHandler: React.FC<GraphErrorHandlerProps> = ({
  emptySearch,
  loading,
  tooLarge,
  emptyGraph,
}) => {
  return (
    <>
      {emptySearch && (
        <div className="empty-search-msg">
          <p className="error-msg">
            No search luck, try again with another name!
          </p>
        </div>
      )}
      {emptyGraph && (
        <div className="graph-empty-placeholder">
          <div className="empty-message">
            There are currently no articles to show on the graph - please go to
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
      {tooLarge && (
        <div className="graph-too-large">
          <p className="too-large-msg">
            Graph has become too large after latest search. Please shrink/clear
            the graph or specify your search further
          </p>
        </div>
      )}
    </>
  );
};

export default GraphErrorHandler;
