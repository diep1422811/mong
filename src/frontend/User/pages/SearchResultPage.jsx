import React from "react";
import Header from "../components/Header";
import "../../../App.css";

import SearchResult from "../components/SearchResult/SearchResult";
const SearchResultPage = () => {
    return (
        <div className="App">
          <Header />
          <SearchResult/>
          {/* <Footer /> */}
        </div>
    );
};

export default SearchResultPage;
