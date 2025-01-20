import React from "react";
import Header from "../../components/Header";
import GenreVN from "../../components/Genre/GenreVN";
import "../../../../App.css";
import BannerSlider from "../../components/BannerSlider";

const CategoryVNPage = () => {
    return (
        <div className="App">
          <Header />
          <BannerSlider />
          <GenreVN/>
        </div>
    );
};

export default CategoryVNPage;
