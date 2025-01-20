import React from "react";
import Header from "../../components/Header";

import "../../../../App.css";
import QuyDinh from "../../components/Rules/QuyDinh";

const QuyDinhPage = () => {
    return (
        <div className="App">
          <Header />
          <QuyDinh/>
          {/* <Footer /> */}
        </div>
    );
};

export default QuyDinhPage;
