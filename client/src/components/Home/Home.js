'use strict';
import React from 'react';
import { useHistory } from 'react-router-dom';
import TinySearchBar from '../TinySearchBar';
import './Home.css';

function Home({ handleQuickSearch }) {
  const history = useHistory();

  const handleRedirect = (path) => {
    history.push('/' + path);
  };

  return (
    <div className="">
      <h1 className="home-title">Ready to arXplore?</h1>
      <div className="home-container">
        <div
          className="home-component"
          onClick={() => handleRedirect('search')}
        >
          <svg className="home-icon" id="search-icon" viewBox="0 0 352 512">
            <linearGradient id="icon-blue-gradient" x2="0.35" y2="1">
              <stop offset="0%" stopColor="var(--blue-stop)" />
              <stop offset="5%" stopColor="var(--blue-stop)" />
              <stop offset="100%" stopColor="var(--blue-bot)" />
            </linearGradient>
            <path
              transform="translate(-60, 0)"
              d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
            ></path>
          </svg>
          <div className="component-description">
            <h3 className="description-header">
              Search for your favorite authors
            </h3>
            <p>
              The search feature allows you to directly query the vast arXiv
              library for all the papers submitted by your favorite authors and
              their collaborators. Go to the search tab or enter an author below
              to get started.
            </p>
          </div>
        </div>
        <div className="home-component" onClick={() => handleRedirect('graph')}>
          <svg className="home-icon" id="graph-icon" viewBox="0 0 352 512">
            <linearGradient id="icon-orange-gradient" x2="0.35" y2="1">
              <stop offset="0%" stopColor="var(--orange-stop)" />
              <stop offset="30%" stopColor="var(--orange-stop)" />
              <stop offset="100%" stopColor="var(--orange-bot)" />
            </linearGradient>
            <path
              transform="translate(-100, 0)"
              d="M267.4 211.6c-25.1 23.7-40.8 57.3-40.8 94.6 0 29.3 9.7 56.3 26 78L203.1 434c-4.4-1.6-9.1-2.5-14-2.5-10.8 0-20.9 4.2-28.5 11.8-7.6 7.6-11.8 17.8-11.8 28.6s4.2 20.9 11.8 28.5c7.6 7.6 17.8 11.6 28.5 11.6 10.8 0 20.9-3.9 28.6-11.6 7.6-7.6 11.8-17.8 11.8-28.5 0-4.2-.6-8.2-1.9-12.1l50-50.2c22 16.9 49.4 26.9 79.3 26.9 71.9 0 130-58.3 130-130.2 0-65.2-47.7-119.2-110.2-128.7V116c17.5-7.4 28.2-23.8 28.2-42.9 0-26.1-20.9-47.9-47-47.9S311.2 47 311.2 73.1c0 19.1 10.7 35.5 28.2 42.9v61.2c-15.2 2.1-29.6 6.7-42.7 13.6-27.6-20.9-117.5-85.7-168.9-124.8 1.2-4.4 2-9 2-13.8C129.8 23.4 106.3 0 77.4 0 48.6 0 25.2 23.4 25.2 52.2c0 28.9 23.4 52.3 52.2 52.3 9.8 0 18.9-2.9 26.8-7.6l163.2 114.7zm89.5 163.6c-38.1 0-69-30.9-69-69s30.9-69 69-69 69 30.9 69 69-30.9 69-69 69z"
            ></path>
          </svg>
          <div className="component-description">
            <h3 className="description-header">
              Explore with the interactive graph
            </h3>
            <p>
              The interactive graph makes it easy to explore and visualise
              author relations, articles and subject clusters. Simply traverse
              your way through the academic landscape by expanding or shrinking
              the graph!
            </p>
          </div>
        </div>
        <div className="home-component" onClick={() => handleRedirect('list')}>
          <svg className="home-icon" id="list-icon" viewBox="0 0 352 512">
            <linearGradient id="icon-purple-gradient" x2="0.35" y2="1">
              <stop offset="0%" stopColor="var(--purple-stop)" />
              <stop offset="5%" stopColor="var(--purple-stop)" />
              <stop offset="100%" stopColor="var(--purple-bot)" />
            </linearGradient>
            <path
              transform="translate(-50, 0)"
              d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"
            ></path>
          </svg>
          <div className="component-description">
            <h3 className="description-header">
              Preview and filter articles in the list
            </h3>
            <p>
              While the graph is great for searching and visualising high level
              features, you sometimes want a closer look. No worries, I have you
              covered - just go to the list whenever you feel the urge for
              details.
            </p>
          </div>
        </div>
      </div>
      <h3 className="intro-tinysearch">
        Perform a quicksearch to get started on the graph:
      </h3>
      <TinySearchBar handleQuickSearch={handleQuickSearch} />
    </div>
  );
}

export default Home;
