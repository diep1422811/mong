import React from "react";
import Header from "../../components/Header";
import NNGenres from "../../components/Genre/NNGenres";
import "../../../../App.css";
import BannerSlider from "../../components/BannerSlider";

const NNGenresPage = () => {
    return (
        <div className="App">
          <Header />
          <BannerSlider />
          <NNGenres/>
        </div>
    );
};

export default NNGenresPage;
