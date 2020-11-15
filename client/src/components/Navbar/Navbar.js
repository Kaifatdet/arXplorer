import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="nav-container">
      <div className="nav-list">
        <Link className="nav-link" id="home" to="/">
          Home
        </Link>
        <Link className="nav-link" id="search" to="/search">
          Search
        </Link>
        <Link className="nav-link" id="graph" to="/graph">
          Graph
        </Link>
        <Link className="nav-link" id="list" to="/list">
          List
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
