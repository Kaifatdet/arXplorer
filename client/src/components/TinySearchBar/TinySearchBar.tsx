/* eslint-disable no-unused-vars */
import React, { FormEvent, useState } from 'react';
import { FunctionComponent } from 'react';
import { ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import './TinySearchBar.css';

interface TinySearchBarProps {
  handleQuickSearch: (author: string) => void;
}

const TinySearchBar: FunctionComponent<TinySearchBarProps> = ({
  handleQuickSearch,
}) => {
  const [search, setSearch] = useState('');
  const history = useHistory();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleQuickSearch(search);
    setSearch('');
    history.push('/graph');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <form className="tiny-container" onSubmit={handleSubmit}>
      <input
        type="text"
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
};

export default TinySearchBar;
