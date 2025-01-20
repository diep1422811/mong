import React, { useState } from "react";
import "./StoriesManagement.css";
import storiesIcon from "./story.png";
import categoriesIcon from "./categories.png";
import bgImage from "./bg.png";
import ListOfStories from "./ListOfStories"
import Categories from "./Categories"


const StoriesManagement = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [content, setContent] = useState(
    // Hình ảnh mặc định hiển thị ban đầu
    <div className="image-container">
      <img src={bgImage} alt="Default Background" />
    </div>
  );
  const handleIconClick = (type) => {
    setActiveButton(type);
  };

  const handleButtonClick = (type) => {
    if (type === "listOfStories") {
      setContent(<div className="content-text"><ListOfStories /></div>);
    } else if (type === "categories") {
      setContent(<div className="content-text"><Categories /></div>);
    } else {
      // Ensure the image is displayed
      setContent(
        <div className="image-container">
          <img src={bgImage} alt="Background" />
        </div>
      );
    }
  };

  return (
    <div className="container">
      <h1>Stories Management</h1>
      <div className="management">

        <div className="icons-container">
          <div className="icon" onClick={() => handleIconClick("listOfStories")}>
            <img src={storiesIcon} alt="ListOfStories" />
          </div>
          <div className="icon" onClick={() => handleIconClick("categories")}>
            <img src={categoriesIcon} alt="Categories" />
          </div>
        </div>

        {activeButton === "listOfStories" && (
          <button className="books-button" type="submit" onClick={() => handleButtonClick("listOfStories")}>
            List Of Stories
          </button>
        )}
        {activeButton === "categories" && (
          <button className="books-button" type="submit" onClick={() => handleButtonClick("categories")}>
            Categories Content
          </button>
        )}

        <div className="rendered-content">{content}</div>
      </div>
    </div>
  );
};

export default StoriesManagement;
