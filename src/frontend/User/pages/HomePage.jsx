import React from "react";
import Header from "../components/Header";
import BannerSlider from "../components/BannerSlider";
import NewBooks from "../components/NewBooks";
import FeaturedBooks from "../components/FeaturedBooks";
import "../../../App.css";
const HomePage = () => {
    return (
        <div className="App">
          <Header />
          <BannerSlider />
          <FeaturedBooks />
          <NewBooks />
        </div>
    );
};

export default HomePage;
