import React from "react";
import Header from "../../components/Header";
import VNGenres from "../../components/Genre/VNGenres";
import "../../../../App.css";
import BannerSlider from "../../components/BannerSlider";

const VNGenresPage = () => {
    return (
        <div className="App">
          <Header />
          <BannerSlider />
          <VNGenres/>
        </div>
    );
};

export default VNGenresPage;
