import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

function Search({ handleSearchForm }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [toGraph, setToGraph] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearchForm(title, author);
    setTitle(() => '');
    setAuthor(() => '');
    setToGraph(() => true);
  };

  const handleTitleChange = (e) => {
    setTitle(() => e.target.value);
  };

  const handleAuthorChange = (e) => {
    setAuthor(() => e.target.value);
  };

  return (
    <>
      {toGraph ? <Redirect to="/graph" /> : null}
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="search-input-title" className="search-label-title">
          Title
        </label>
        <input
          type="text"
          className="search-input-title"
          value={title}
          onChange={handleTitleChange}
        />
        <label htmlFor="search-input-author" className="search-label-author">
          Author
        </label>
        <input
          type="text"
          className="search-input-author"
          name="search-input-author"
          value={author}
          onChange={handleAuthorChange}
        />
        <input type="submit" className="search-submit-graph" value="Search" />
      </form>
    </>
  );
}

export default Search;
