import React, { useEffect } from 'react';
import './RightSidebar.css';

function RightSidebar({ selected, handleExpandClick }) {
  useEffect(() => {
    console.log('in sidebar', selected);
  }, [selected]);

  const clickHandler = () => {
    handleExpandClick();
  };

  return (
    <div className="rsb-container">
      <div className="rsb-author">Author: {selected}</div>
      <button type="submit" className="rsb-expand-btn" onClick={clickHandler}>
        Expand graph
      </button>
    </div>
  );
}

export default RightSidebar;
