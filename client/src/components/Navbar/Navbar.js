import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="nav-container">
      <div className="nav-list">
        <Link className="nav-link" to="/">
          Home
        </Link>
        <Link className="nav-link" to="/search">
          Search
        </Link>
        <Link className="nav-link" to="/graph">
          Graph
        </Link>
        <Link className="nav-link" to="/list">
          List
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
