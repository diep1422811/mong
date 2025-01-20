import React from "react";
import Header from "../../components/Header";
import UpdateStory from "../../components/UpdateStory/UpdateStory";
import "../../../../App.css";

const UpdateStoryPage = () => {
    return (
        <div className="App">
          <Header />
          <UpdateStory/>
        </div>
    );
};

export default UpdateStoryPage;
