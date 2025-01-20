import React from "react";
import Header from "../../components/Header";
import BannerSlider from "../../components/BannerSlider";
import ReviewCategory from "./ReviewCat"

import "../../../../App.css";
const ReviewHome = () => {
    return (
        <div className="App">
          <Header />
          <BannerSlider />
          <ReviewCategory />
        </div>
    );
};

export default ReviewHome;
