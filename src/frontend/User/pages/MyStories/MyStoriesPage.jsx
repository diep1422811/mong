import React from "react";
import Header from "../../components/Header";
import MyStories from "../../components/MyStories/MyStories";

const MyStoriesPage = () => {
  return (
    <div className="header">
      <Header />
      <div className="my-stories">
        <MyStories />
      </div>
    </div>
  );
};

export default MyStoriesPage;
