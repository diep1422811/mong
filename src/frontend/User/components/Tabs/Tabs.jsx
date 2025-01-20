import React from "react";
import "./Tabs.css";
import { useNavigate } from "react-router-dom";

function Tabs() {
  const navigate = useNavigate();
  return (
    <div className="tabs">
      <button onClick={() => navigate("/gioi-thieu/:bookId")}>Giới thiệu</button>
      <button onClick={() => navigate("/muc-luc/:bookId")}>Mục lục</button>
    </div>
    
   
  );
}

export default Tabs;
