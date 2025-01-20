import React from "react";
import Header from "../../components/Header";
import NovelGenres from "../../components/Genre/NovelGenres";
import "../../../../App.css";
import BannerSlider from "../../components/BannerSlider";

const NovelGenresPage = () => {
    return (
        <div className="App">
          <Header />
          <BannerSlider />
          <NovelGenres/>
        </div>
    );
};

export default NovelGenresPage;
