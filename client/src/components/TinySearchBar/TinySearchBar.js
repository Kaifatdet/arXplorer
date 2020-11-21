import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './TinySearchBar.css';

function TinySearchBar({ handleQuickSearch }) {
  const [search, setSearch] = useState('');
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleQuickSearch(search);
    setSearch('');
    history.push('/graph');
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <form className="tiny-container" onSubmit={handleSubmit}>
      <label className="search-label" htmlFor="search-bar">
        Quick Search
      </label>
      <input
        type="text"
        id="search-bar"
        name="tiny-search"
        className="tinysearch-input"
        value={search}
        placeholder="Search for author..."
        onChange={handleChange}
      />
      <button type="submit" className="tinysearch-btn">
        Quicksearch
      </button>
    </form>
  );
}

export default TinySearchBar;
