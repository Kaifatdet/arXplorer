import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Search.css';
import { subjects } from '../../services/categories';
import LoadingSpinner from '../../styleComponents/LoadingSpinner.js';

function Search({ handleSearchForm, loading, setSelectedAuthor }) {
  const init = {
    title: '',
    author: '',
    journal: '',
    abstract: '',
  };

  const filterInit = {
    cs: false,
    physics: false,
    math: false,
    eess: false,
    econ: false,
    'q-bio': false,
    'q-fin': false,
    stat: false,
    'date-from': '',
    'date-to': '',
  };

  const [fields, setFields] = useState(init);
  const [filters, setFilters] = useState(filterInit);
  const [searchSuccess, setSearchSuccess] = useState(true);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSelectedAuthor('');
    const res = await handleSearchForm(
      fields.title,
      fields.author,
      fields.journal,
      fields.abstract,
      filters
    );
    setFields(() => init);
    setFilters(() => init);
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

  const handleFilters = (e) => {
    setFilters((prev) => {
      const newState = { ...prev };
      newState[e.target.value] = !newState[e.target.value];
      return newState;
    });
  };

  const handleDatePicker = (e) => {
    setFilters((prev) => {
      const newState = { ...prev };
      newState[e.target.name] = new Date(e.target.value);
      return newState;
    });
  };

  const surprise = () => {
    const appClass = document.getElementsByClassName('App')[0].classList;
    appClass.length === 1
      ? appClass.add('wrapper')
      : appClass.remove('wrapper');
  };

  return (
    <>
      <div className="search-header">
        <p className="lulz">S</p>
        <p className="lulz">e</p>
        <p className="lulz">a</p>
        <p className="lulz" onClick={surprise}>
          r
        </p>
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
                  onChange={handleDatePicker}
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
                  onChange={handleDatePicker}
                />
              </div>
            </div>
          </div>
          <h3 style={{ marginTop: '1rem' }}>Subject</h3>
          <div className="search-filter-categories">
            {Object.keys(subjects).map((cat) => (
              <div key={cat} className="subject-container">
                <label className="switch">
                  <input
                    id="checkbox"
                    type="checkbox"
                    value={cat}
                    onChange={handleFilters}
                  />
                  <span className="slider round"></span>
                </label>
                <label htmlFor={cat}>{subjects[cat]}</label>
              </div>
            ))}
          </div>
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
