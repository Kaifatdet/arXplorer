'use strict';
import React from 'react';
import TinySearchBar from '../TinySearchBar';

function Home({ handleQuickSearch }) {
  return (
    <div className="">
      <h1>Home</h1>
      <div className="home-container">
        <p className="home-paragraph">Some text in here that is very long</p>
      </div>
      <TinySearchBar handleQuickSearch={handleQuickSearch} />
    </div>
  );
}

export default Home;
