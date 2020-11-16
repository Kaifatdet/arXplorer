import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import './Search.css';
import { subjects } from '../../services/categories';

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
      {toGraph && <Redirect to="/graph" />}
      {/* <h1 className="search-header"></h1> */}
      <div className="search-header">
        <p className="lulz">S</p>
        <p className="lulz">e</p>
        <p className="lulz">a</p>
        <p className="lulz">r</p>
        <p className="lulz">c</p>
        <p className="lulz">h</p>
      </div>
      <div className="search-form-container">
        <form className="search-form" onSubmit={handleSubmit}>
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
            <label
              htmlFor="search-input-author"
              className="search-label-author"
            >
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
        <div className="search-filters">
          <div className="search-filter-date-picker">
            <h3>Publication date</h3>
            <div className="date-picker-container">
              <div>
                <label htmlFor="date-from" style={{ marginRight: '1rem' }}>
                  From:{' '}
                </label>
                <input
                  type="date"
                  className="date-picker"
                  name="date-from"
                  id="date-from"
                />
              </div>
              <div>
                <label htmlFor="date-to" style={{ marginRight: '1rem' }}>
                  {' '}
                  to:
                </label>
                <input
                  type="date"
                  className="date-picker"
                  name="date-to"
                  id="date-from"
                />
              </div>
            </div>
          </div>
          <h3 style={{ marginTop: '1rem' }}>Subject</h3>
          <div className="search-filter-categories">
            {Object.keys(subjects).map((cat) => (
              <div key={cat} className="subject-container">
                <label className="switch">
                  <input id="checkbox" type="checkbox" value={cat} />
                  <span className="slider round"></span>
                </label>
                <label htmlFor={cat}>{subjects[cat]}</label>
              </div>
            ))}
          </div>
          <div className="search-filter-strict">
            <h3>Search fuzzy</h3>
            <label className="switch">
              <input id="checkbox" type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
            If fuzzy search is checked, the search will look for first name OR
            last name (in the case of an author search). It is recommended to do
            strict searches.
          </p>
        </div>
      </div>
    </>
  );
}

export default Search;
