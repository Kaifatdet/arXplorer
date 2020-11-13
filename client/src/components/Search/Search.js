import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import './Search.css';

function Search({ handleSearchForm }) {
  const init = {
    author: '',
    title: '',
    journal: '',
    abstract: '',
  };
  const [fields, setFields] = useState(init);
  const [toGraph, setToGraph] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearchForm(
      fields.title,
      fields.author,
      fields.journal,
      fields.abstract
    );
    setFields(() => init);
    setToGraph(() => true);
  };

  const handleChange = (e) => {
    setFields((prev) => {
      const newState = { ...prev };
      newState[e.target.name] = e.target.value;
      return newState;
    });
  };

  return (
    <>
      {toGraph ? <Redirect to="/graph" /> : null}
      <form className="search-form" onSubmit={handleSubmit}>
        <h1>Search</h1>
        <div className="search-title">
          <label htmlFor="search-input-title" className="search-label-title">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="search-input-title"
            value={fields.title}
            onChange={handleChange}
          />
        </div>
        <div className="search-author">
          <label htmlFor="search-input-author" className="search-label-author">
            Author
          </label>
          <input
            type="text"
            name="author"
            className="search-input-author"
            value={fields.author}
            onChange={handleChange}
          />
        </div>
        <div className="search-journal">
          <label
            htmlFor="search-input-journal"
            className="search-label-journal"
          >
            Journal
          </label>
          <input
            type="text"
            name="journal"
            className="search-input-journal"
            value={fields.journal}
            onChange={handleChange}
          />
        </div>
        <div className="search-abstract">
          <label
            htmlFor="search-input-abstract"
            className="search-label-abstract"
          >
            Abstract
          </label>
          <input
            type="text"
            name="abstract"
            className="search-input-abstract"
            value={fields.abstract}
            onChange={handleChange}
          />
        </div>
        <input type="submit" className="search-submit" value="Search" />
      </form>
    </>
  );
}

export default Search;
