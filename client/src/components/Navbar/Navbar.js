import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="nav-container">
      <div className="nav-list">
        <NavLink
          className="nav-link"
          id="home"
          exact
          to="/"
          activeStyle={{
            background:
              '-webkit-linear-gradient(270deg, rgb(17, 255, 0), rgb(1, 60, 18))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: 'scale(1.1)',
          }}
        >
          Home
        </NavLink>
        <NavLink
          className="nav-link"
          id="search"
          to="/search"
          activeStyle={{
            background:
              '-webkit-linear-gradient(270deg, rgb(0, 255, 255), rgb(0, 73, 125))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: 'scale(1.1)',
          }}
        >
          Search
        </NavLink>
        <NavLink
          className="nav-link"
          id="graph"
          to="/graph"
          activeStyle={{
            background:
              '-webkit-linear-gradient(270deg, rgb(255, 187, 0), rgb(166, 1, 1))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: 'scale(1.1)',
          }}
        >
          Graph
        </NavLink>
        <NavLink
          className="nav-link"
          id="list"
          to="/list"
          activeStyle={{
            background:
              '-webkit-linear-gradient(270deg, rgb(255, 0, 242), rgb(34, 0, 62))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: 'scale(1.1)',
          }}
        >
          List
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
