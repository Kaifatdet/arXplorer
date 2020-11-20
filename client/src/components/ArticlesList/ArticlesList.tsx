import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import './ArticlesList.css';
import { categoriesDict } from '../../services/categories';
import { Link, useHistory } from 'react-router-dom';
import {
  sortArticleList,
  getArticleId,
  parseGreekLetters,
} from '../../services/dataHelpers';
import Article from '../../types/Article';
import Category from '../../types/Category';

type ArticleListProps = {
  articleList: Article[];
  selectedAuthor: string;
  authorDict: any;
  setSelectedAuthor: any;
  selectedArticle: string;
  setSelectedArticle: any;
};

const ArticlesList: React.FC<ArticleListProps> = ({
  articleList,
  selectedAuthor,
  authorDict,
  setSelectedAuthor,
  selectedArticle,
  setSelectedArticle,
}) => {
  const [filteredList, setFilteredList] = useState<[] | any>([]);
  const [categories, setCategories] = useState<[] | any>([]);
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const history = useHistory();

  useEffect(() => {
    setFilteredList(() => sortArticleList([...articleList]));
    if (authorDict[selectedAuthor]) {
      setFilteredList(() =>
        selectedArticle
          ? sortArticleList([
              ...authorDict[selectedAuthor].articles.filter(
                (ar) => getArticleId(ar) === selectedArticle
              ),
            ])
          : sortArticleList([...authorDict[selectedAuthor].articles])
      );
    }

    if (articleList.length > 0) {
      setCategories(() => {
        let catDict = {};
        articleList.forEach((ar) => {
          ar.category.forEach((cat: Category) => {
            if (!catDict[cat.$.term] && categoriesDict[cat.$.term])
              catDict[cat.$.term] = categoriesDict[cat.$.term];
          });
        });
        return catDict;
      });
    }
  }, [selectedArticle, selectedAuthor]);

  if (articleList.length === 0) {
    return (
      <div className="graph-empty-placeholder">
        <div className="empty-message">
          There is currently no articles to show on the list - please go to the{' '}
          <Link to="/search" id="search-redirect-link">
            search
          </Link>{' '}
          page.
        </div>
      </div>
    );
  }

  const handleDateFilter = (e) => {
    setSortOrder(e.target.value);
    setFilteredList(() => {
      return e.target.value === 'newest'
        ? sortArticleList([...filteredList])
        : sortArticleList([...filteredList], 'oldest');
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
          au.name[0].toLowerCase().includes(e.target.value.toLowerCase())
        );

        const tempTitle = ar.title[0]
          .toLowerCase()
          .includes(e.target.value.toLowerCase());

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

  const handleResetAuthor = () => {
    setSelectedAuthor('');
    setSelectedArticle('');
  };

  const clearSelectedArticle = () => {
    setSelectedArticle('');
  };

  return (
    <div className="list-container">
      {selectedAuthor ? (
        <div className="list-top selectedAuth">
          <svg
            className="list-return"
            viewBox="0 0 352 512"
            onClick={handleReturn}
          >
            <linearGradient id="icon-blue-gradient" x2="0.35" y2="1">
              <stop offset="0%" stopColor="var(--blue-stop)" />
              <stop offset="30%" stopColor="var(--blue-stop)" />
              <stop offset="100%" stopColor="var(--blue-bot)" />
            </linearGradient>
            <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
          </svg>
          <div className="header-container">
            <h1 className="articles-header">Articles</h1>
            <p id="header-author" className="author-selected">
              {'by ' + selectedAuthor}
            </p>
          </div>
          <svg
            className="rsb-icon-close"
            viewBox="0 0 352 512"
            onClick={handleResetAuthor}
          >
            <defs>
              <linearGradient id="icon-red-gradient" x2="0.35" y2="1">
                <stop offset="0%" stopColor="var(--red-stop)" />
                <stop offset="30%" stopColor="var(--red-stop)" />
                <stop offset="100%" stopColor="var(--red-bot)" />
              </linearGradient>
            </defs>
            <path
              d="M242.72 256
            l100.07-100.07
            c12.28-12.28 12.28-32.19 0-44.48
            l-22.24-22.24
            c-12.28-12.28-32.19-12.28-44.48 0
            L176 189.28 75.93 89.21
            c-12.28-12.28-32.19-12.28-44.48 0
            L9.21 111.45
            c-12.28 12.28-12.28 32.19 0 44.48
            L109.28 256 9.21 356.07
            c-12.28 12.28-12.28 32.19 0 44.48
            l22.24 22.24
            c12.28 12.28 32.2 12.28 44.48 0
            L176 322.72
            l100.07 100.07
            c12.28 12.28 32.2 12.28 44.48 0
            l22.24-22.24
            c12.28-12.28 12.28-32.19 0-44.48
            L242.72 256
            z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="list-top">
          <div className="header-container">
            <h1 className="articles-header">Articles</h1>
            <p id="header-author" className="author-not-selected"></p>
          </div>
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
        <h4>Filter articles by:</h4>
        <div className="filter-selectors">
          <div className="date-selector">
            <p>Published: </p>
            <select
              name="select-date"
              className="select-date select"
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
              className="select-cat select"
              onChange={handleCategoryFilter}
            >
              <option value="none">Show all</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {categories[cat]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="list-total-numbers">
          <p className="num-articles">
            Total # of articles: {articleList.length}
          </p>
          <p className="num-articles">
            Currently showing: {filteredList.length}
          </p>
        </div>
      </div>
      {filteredList.length > 0 && articleList.length > 0 ? (
        filteredList.map((ar) => (
          <div key={getArticleId(ar)} className="list-article">
            <div className="list-article-title">
              {parseGreekLetters(ar.title[0])}
            </div>
            <div className="list-article-authors">
              <strong>Authors: </strong>
              {ar.author.map((au) => au.name).join(', ')}
            </div>
            <div className="list-article-abstract">
              <strong>Abstract: </strong>
              {parseGreekLetters(ar.summary[0].replace(/[\n]+/g, ' '))}
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
                  rel="noreferrer"
                  target="_blank"
                  href={`http://arxiv.org/abs/${getArticleId(ar)}`}
                >
                  See article on arXiv.org
                </a>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>
          <h1
            style={{
              fontStyle: 'italic',
              fontWeight: 'normal',
              marginBottom: '1rem',
            }}
          >
            Sorry, you filtered too hard
          </h1>
        </div>
      )}
      {selectedArticle && (
        <div className="list-clear-article" onClick={clearSelectedArticle}>
          <h3>Show all articles by {selectedAuthor}</h3>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
