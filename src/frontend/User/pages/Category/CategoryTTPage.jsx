import React from "react";
import Header from "../../components/Header";
import GenreTT from "../../components/Genre/GerenTT";
import "../../../../App.css";
import BannerSlider from "../../components/BannerSlider";


const CategoryTTPage = () => {
    return (
        <div className="App">
          <Header />
          <BannerSlider />
          <GenreTT/>
        </div>
    );
};

export default CategoryTTPage;
