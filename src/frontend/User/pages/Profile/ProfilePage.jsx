import React from "react";
import Header from "./ViewProfile/Header";
import ViewProfile from "./ViewProfile/ViewProfile";
import "../../../../App.css";
import { useParams } from "react-router-dom";

const ViewProfilePage = () => {
  const { idUser } = useParams(); // Lấy idUser từ URL
    return (
        <div className="App">
          <Header />
          <ViewProfile/>
        </div>
    );
};

export default ViewProfilePage;
