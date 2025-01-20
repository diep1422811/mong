import React from "react";
import Header from "../../components/Header";
import CreateChapter from "../../components/Chapter/CreateChapter";
import "../../../../App.css";

const AddChapterPage = () => {
    return (
        <div className="App">
          <Header />
          <CreateChapter/>
        </div>
    );
};

export default AddChapterPage;
