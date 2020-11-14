/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import './ArticlesList.css';
import { categoriesDict } from '../../services/categories';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { sortArticleList } from '../../services/dataHelpers';

function ArticlesList({ articleList, selectedAuthor, authorDict }) {
  const [filteredList, setFilteredList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setFilteredList(() => sortArticleList([...articleList]));

    if (authorDict[selectedAuthor]) {
      setFilteredList(() =>
        sortArticleList([...authorDict[selectedAuthor].articles])
      );
    }

    if (articleList.length > 0) {
      setCategories(() => {
        let catDict = {};
        articleList.forEach((ar) => {
          ar.category.forEach((cat) => {
            if (!catDict[cat.$.term] && categoriesDict[cat.$.term])
              catDict[cat.$.term] = categoriesDict[cat.$.term];
          });
        });
        return catDict;
      });
    }
  }, []);

  if (articleList.length === 0) {
    return (
      <div className="no-articles">
        No articles to show yet, please perform a{' '}
        <Link to="/search" className="redirect">
          search
        </Link>
      </div>
    );
  }

  const handleDateFilter = (e) => {
    setSortOrder(e.target.value);
    setFilteredList(() => {
      return e.target.value === 'newest'
        ? sortArticleList([...filteredList])
        : sortArticleList([...filteredList], false);
    });
  };

  const handleCategoryFilter = (e) => {
    setFilteredList(() => {
      if (e.target.value === 'none') return [...articleList];
      const filtered = articleList.map((ar) => {
        const tempCat = ar.category.filter(
          (cat) => cat.$.term === e.target.value
        );
        if (tempCat.length > 0) return ar;
      });
      return sortArticleList(
        [...filtered].filter((el) => el !== undefined),
        sortOrder
      );
    });
  };

  const handleSearchFilter = (e) => {
    setFilteredList(() => {
      const filtered = articleList.map((ar) => {
        const tempAuth = ar.author.filter((au) =>
          au.name[0].toLowerCase().includes(e.target.value)
        );

        const tempTitle = ar.title[0].toLowerCase().includes(e.target.value);

        if (tempAuth.length > 0 || tempTitle) return ar;
      });
      return sortArticleList(
        [...filtered].filter((el) => el !== undefined),
        sortOrder
      );
    });
  };

  const handleReturn = () => {
    history.push('/graph');
  };

  return (
    <div className="list-container">
      {selectedAuthor ? (
        <div className="list-top">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="list-return icon"
            onClick={handleReturn}
          />
          <h1 className="articles-header">Articles by {selectedAuthor}</h1>
        </div>
      ) : (
        <div className="list-top">
          <h1 className="articles-header">Articles</h1>
        </div>
      )}
      <div className="list-filters">
        <input
          type="text"
          name="filter-search"
          className="filter-search"
          onChange={handleSearchFilter}
          placeholder="Search author or title..."
        />
        <div className="filter-selectors">
          <div className="date-selector">
            <p>Published: </p>
            <select
              name="select-date"
              className="select-date"
              onChange={handleDateFilter}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
          <div className="category-selector">
            <p>Categories: </p>
            <select
              name="select-category"
              className="select-cat"
              onChange={handleCategoryFilter}
            >
              <option value="none">None</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {categories[cat]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {filteredList.length > 0
        ? filteredList.map((ar) => (
            <div
              key={ar.id[0].replace('http://arxiv.org/abs/', '')}
              className="list-article"
            >
              <div className="list-article-title">{ar.title[0]}</div>
              <div className="list-article-authors">
                <strong>Authors: </strong>
                {ar.author.map((au) => au.name).join(', ')}
              </div>
              <div className="list-article-abstract">
                <strong>Abstract: </strong>
                {ar.summary[0].replace(/[\n]+/g, ' ')}
              </div>
              <div className="list-article-published">
                <strong>Published: </strong>
                {dayjs(ar.published[0]).format('MMM YYYY')}
              </div>
              <div className="list-bottom">
                <div className="list-article-categories">
                  <strong>Categories: </strong>
                  {ar.category
                    .map((au) => {
                      if (categoriesDict[au.$.term]) {
                        return categoriesDict[au.$.term];
                      }
                    })
                    .filter((el) => el !== undefined)
                    .join(', ')}
                </div>
                <div className="list-article-link">
                  <a
                    className="arxiv-link"
                    href={`http://arxiv.org/abs/${ar.id[0].replace(
                      'http://arxiv.org/abs/',
                      ''
                    )}`}
                  >
                    See article on arXiv.org
                  </a>
                </div>
              </div>
            </div>
          ))
        : 'No articles are matching filters'}
    </div>
  );
}

export default ArticlesList;
