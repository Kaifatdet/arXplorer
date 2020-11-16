import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Search.css';
import { subjects } from '../../services/categories';
import LoadingSpinner from '../../styleComponents/LoadingSpinner.js';

function Search({ handleSearchForm, loading }) {
  const init = {
    title: '',
    author: '',
    journal: '',
    abstract: '',
  };
  const [fields, setFields] = useState(init);
  const [searchSuccess, setSearchSuccess] = useState(true);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await handleSearchForm(
      fields.title,
      fields.author,
      fields.journal,
      fields.abstract
    );
    setFields(() => init);
    if (res) {
      setSearchSuccess(true);
      history.push('/graph');
    } else {
      setSearchSuccess(false);
    }
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
          {Object.keys(fields).map((field) => (
            <div key={field} className={`search-${field}`}>
              <label
                htmlFor={`search-input-${field}`}
                className={`search-label-${field}`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                name={field}
                className={`search-input-${field}`}
                value={fields[field]}
                onChange={handleChange}
              />
            </div>
          ))}
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
      {loading && (
        <div className="search-loading-widget">
          <LoadingSpinner />
        </div>
      )}
      {!searchSuccess && (
        <h4 className="search-error-msg">
          No search luck, try to refine your search
        </h4>
      )}
    </>
  );
}

export default Search;
