import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import './ArticlesList.css';
import { categoriesDict } from '../../services/categories';

function ArticlesList({ authorDict, articleList }) {
  useEffect(() => {
    console.log('authors', authorDict);
  }, [articleList]);

  if (articleList.length === 0) {
    return (
      <div className="no-articles">
        No articles to show yet, please perform a search
      </div>
    );
  }

  return (
    <div className="list-container">
      <h1 className="articles-header">Articles</h1>
      {articleList.map((ar) => (
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
            {ar.summary[0].replace(/[\n]+/g, '')}
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
                    console.log(ar.link);
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
      ))}
    </div>
  );
}

export default ArticlesList;
