import React, { useState } from "react";
import SideBar from "../SideBar/SideBar";
import NavBar from "../NavBar/NavBar";
import { Outlet } from "react-router-dom";  // Dùng để render nội dung của các trang con
import "./Layout.css"
const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <SideBar className="navigation" toggleSidebar={toggleSidebar} />
      <div className="content">
        <NavBar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Layout;
