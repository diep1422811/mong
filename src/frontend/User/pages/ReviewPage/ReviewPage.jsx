import React from "react";
import Header from "../../components/Header";
import Review from "../../components/ReviewPage/Review";
import "../../../../App.css"


const ReviewPage = () => {
    return (
        <div className="App">
          <Header />
          <Review/>
        </div>
    );
};

export default ReviewPage;
