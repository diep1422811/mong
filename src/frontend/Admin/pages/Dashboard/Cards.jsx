import React, { useState, useEffect } from "react";
import "./Cards.css";
import Card from "./Card";
import { FaPeopleGroup } from "react-icons/fa6";
import { SiWikibooks } from "react-icons/si";
import { MdPageview } from "react-icons/md";

const Cards = () => {
  const [cardData, setCardData] = useState([]);

  const fetchStats = async () => {

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
  
      const response = await fetch("http://3.26.145.187:8000/api/dashboard/chart-data", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Thêm token vào header
        },
      });

      const data = await response.json();

      const formattedData = [
        {
          title: "Total Users",
          color: {
            backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
            boxShadow: "0px 10px 20px 0px #e0c6f5",
          },
          barValue: data.new_users ? (data.new_users / 200) * 100 : 0,
          value: data.new_users || 0,
          png: FaPeopleGroup,
        },
        {
          title: "Total Stories",
          color: {
            backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
            boxShadow: "0px 10px 20px 0px #FDC0C7",
          },
          barValue: data.new_stories ? (data.new_stories / 200) * 100 : 0,
          value: data.new_stories || 0,
          png: SiWikibooks,
        },
        {
          title: "Page Views",
          color: {
            backGround: "linear-gradient(180deg, #FDC830 0%, #F37335 100%)",
            boxShadow: "0px 10px 20px 0px #F9D59B",
          },
          barValue: data.pageviews_last_24h ? (data.pageviews_last_24h / 200) * 100 : 0,
          value: data.pageviews_last_24h || 0,
          png: MdPageview,
        },
      ];

      setCardData(formattedData);
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);
  const [filterType, setFilterType] = useState("24h");

  const handleFilterChange = (newFilter) => {
    setFilterType(newFilter);
  };
  
  return (
    <div className="Cards">
      <div>
        {/* Các nút filter */}
        <button onClick={() => handleFilterChange("24h")}>Last 24 Hours</button>
        <button onClick={() => handleFilterChange("week")}>Last Week</button>
        <button onClick={() => handleFilterChange("month")}>Last Month</button>
      </div>
      
      {cardData.map((card, id) => (
        <div className="parentContainer" key={id}>
          <Card
            title={card.title}
            color={card.color}
            barValue={card.barValue}
            value={card.value}
            filterType={filterType} 
          />
        </div>
      ))}
    </div>
  );  
};

export default Cards;
