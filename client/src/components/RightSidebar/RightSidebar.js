import React, { useEffect, useState } from 'react';
import * as dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './RightSidebar.css';

function RightSidebar({
  selected,
  handleExpandClick,
  authorDict,
  toggleSelected,
}) {
  const [details, setDetails] = useState({});
  const [toggled, setToggled] = useState('hide');

  useEffect(() => {
    if (selected) {
      let selectedDetails = authorDict[selected];
      setDetails(selectedDetails);
      setToggled('show');
      console.log(selectedDetails);
    }
  }, [selected]);

  const clickHandler = () => {
    handleExpandClick();
  };

  const toggleSidebar = () => {
    toggleSelected();
    setToggled('hide');
  };

  return (
    <div className={`rsb-container ${toggled}`}>
      <div className="rsb-icon">
        <FontAwesomeIcon
          icon={faTimes}
          className="rsb-icon-close"
          onClick={toggleSidebar}
        />
      </div>
      <div className="rsb-details">
        <div className="rsb-author">{selected}</div>
        <div className="rsb-collabs">
          # of collaborators:
          {selected && details['collabs'] ? details['collabs'].length : 0}
        </div>
      </div>
      <div className="rsb-list">
        {selected && details['articles']
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
      <button type="submit" className="rsb-expand-btn" onClick={clickHandler}>
        Expand graph
      </button>
    </div>
  );
}

export default RightSidebar;

// {return  (selected && details['articles'].length !== 0)
//           ? details.articles.map((ar) => {
//               <div className="rsb-list-article">
//                 <div className="rsb-list-article">ar.title</div>
//                 {/* <div className="rsb-list-article">
//               ar.author.map()
//             </div> */}
//                 <div className="rsb-list-published">ar.published</div>
//               </div>
//           })
//           : 'No articles to show'
//         }
