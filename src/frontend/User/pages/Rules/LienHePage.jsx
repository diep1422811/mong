import React from "react";
import Header from "../../components/Header";
import "../../../../App.css";
import LienHe from "../../components/Rules/LienHe";

const LienHePage = () => {
    return (
        <div className="App">
          <Header />
          <LienHe/>
          {/* <Footer /> */}
        </div>
    );
};

export default LienHePage;
