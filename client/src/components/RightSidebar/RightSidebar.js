import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './RightSidebar.css';

function RightSidebar({
  selectedAuthor,
  handleExpandClick,
  authorDict,
  toggleSelected,
  handleSidebarAuthorRedirect,
  resetSelectedAuthor,
  removeSelectedAuthor,
}) {
  const [details, setDetails] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedAuthor) {
      console.log(selectedAuthor);
      let selectedDetails = authorDict[selectedAuthor];
      setDetails(selectedDetails);
      setOpen(true);
    }
  }, [selectedAuthor]);

  const clickHandler = () => {
    handleExpandClick();
  };

  const toggleSidebar = () => {
    toggleSelected();
    setOpen(false);
    resetSelectedAuthor();
  };

  const renderList = () => {
    return selectedAuthor && details['articles'];
  };

  const handleAuthorClick = () => {
    handleSidebarAuthorRedirect(selectedAuthor);
  };

  const deleteHandler = () => {
    removeSelectedAuthor(selectedAuthor);
    setOpen(false);
  };

  return (
    <div className={`rsb-container ${open ? 'show' : 'hide'}`}>
      <div className="rsb-icon">
        <FontAwesomeIcon
          icon={faTimes}
          className="rsb-icon-close icon"
          onClick={toggleSidebar}
        />
      </div>
      <div className="rsb-details">
        <div className="rsb-author" onClick={handleAuthorClick}>
          <Link className="rsb-author" to="/list">
            {selectedAuthor}
          </Link>
        </div>
        <div className="rsb-small-link">
          <Link to="/list" id="redirect-link">
            show details
          </Link>
        </div>
      </div>
      <div className="rsb-list">
        {renderList()
          ? details.articles.map((ar) => {
              return (
                <div key={ar.id} className="rsb-list-article">
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
