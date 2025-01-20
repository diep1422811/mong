import React, { useState } from 'react';
import './ChapterList.css';
import { Link } from 'react-router-dom';

const ChapterList = ({ chapters }) => {
  const [hoveredChapter, setHoveredChapter] = useState(null);

  return (
    <div className="chapter-list">
      <ul>
        {chapters.map((chapter) => (
          <li
            key={chapter.id}
            className="chapter-item"
            onMouseEnter={() => setHoveredChapter(chapter.id)}
            onMouseLeave={() => setHoveredChapter(null)}
          >
            <Link to={`/chapter/${chapter.id}`} className="chapter-link">
              <span className="chapter-title">{chapter.title}</span>
            </Link>
            <span className="chapter-date"> {chapter.date}</span>
            <span className="view-count">
              <i className="eye icon"></i> {chapter.views}
            </span>
          </li>
        ))}
      </ul>
     
    </div>
  );
};

export default ChapterList;
