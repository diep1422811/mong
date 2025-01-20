import React from "react";
import Header from "../../components/Header";

import "../../../../App.css";
import HuongDan from "../../components/Rules/HuongDan";

const HuongDanPage = () => {
    return (
        <div className="App">
          <Header />
          <HuongDan/>
          {/* <Footer /> */}
        </div>
    );
};

export default HuongDanPage;
