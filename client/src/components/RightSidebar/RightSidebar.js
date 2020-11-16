import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import './RightSidebar.css';
import { getArticleId } from '../../services/dataHelpers';

function RightSidebar({
  selectedAuthor,
  handleExpandClick,
  authorDict,
  setSelectedAuthor,
  setSelectedArticle,
  removeSelectedAuthor,
}) {
  const [details, setDetails] = useState({});
  const [open, setOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (selectedAuthor) {
      setDetails(authorDict[selectedAuthor]);
      setOpen(true);
    }
  }, [selectedAuthor]);

  const clickHandler = () => {
    handleExpandClick();
  };

  const toggleSidebar = () => {
    setOpen(false);
    setSelectedAuthor('');
    setSelectedArticle('');
  };

  const renderList = () => {
    return selectedAuthor && details['articles'];
  };

  const handleAuthorClick = () => {
    setSelectedAuthor(selectedAuthor);
    setSelectedArticle('');
    history.push('/list');
  };

  const deleteHandler = () => {
    removeSelectedAuthor(selectedAuthor);
    setSelectedArticle('');
    setOpen(false);
  };

  const handleArticleClick = (id) => {
    setSelectedArticle(id);
    setSelectedAuthor(selectedAuthor);
    history.push('/list');
  };

  return (
    <div className={`rsb-container ${open ? 'show-rsb' : 'hide-rsb'}`}>
      <div className="rsb-icon">
        <svg
          className="rsb-icon-close"
          viewBox="0 0 352 512"
          onClick={toggleSidebar}
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
      <div className="rsb-details">
        <div className="rsb-author" onClick={handleAuthorClick}>
          {selectedAuthor}
        </div>
        <div className="rsb-small-link" onClick={handleAuthorClick}>
          show details
        </div>
      </div>
      <div className="rsb-list">
        {renderList()
          ? details.articles.map((ar) => {
              return (
                <div
                  key={getArticleId(ar)}
                  className="rsb-list-article"
                  onClick={() => handleArticleClick(getArticleId(ar))}
                >
                  <div className="rsb-article-title">{ar.title}</div>
                  <div className="rsb-article-authors">
                    {ar.author.map((au) => au.name).join(', ')}
                  </div>
                  <div className="rsb-article-published">
                    {dayjs(ar.published[0]).format('MMM YYYY')}
                  </div>
                </div>
              );
            })
          : 'No articles to display'}
      </div>
      <div className="rsb-buttons-container">
        <button type="submit" className="rsb-expand-btn" onClick={clickHandler}>
          Expand graph
        </button>
        <button
          type="submit"
          className="rsb-delete-btn"
          onClick={deleteHandler}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default RightSidebar;
