import React from "react";
import Header from "../../components/Header";
import GenreNN from "../../components/Genre/GenreNN";
import "../../../../App.css";
import BannerSlider from "../../components/BannerSlider";

const CategoryNNPage = () => {
    return (
        <div className="App">
          <Header />
          <BannerSlider />
          <GenreNN/>
        </div>
    );
};

export default CategoryNNPage;
