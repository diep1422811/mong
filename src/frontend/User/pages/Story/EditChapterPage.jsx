import React from "react";
import Header from "../../components/Header";
import EditChapter from "../../components/Chapter/EditChapter";
import "../../../../App.css";

const EditChapterPage = () => {
    return (
        <div className="App">
          <Header />
          <EditChapter/>
        </div>
    );
};

export default EditChapterPage;
