import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SideBar.css";
import logo from "../logo.jpg";
import { FaBars, FaUserFriends, FaBook, FaComments, FaRegFlag, FaClipboard } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarColor, setSidebarColor] = useState("#ffc0cb");
  const [role, setRole] = useState(null); // Lưu vai trò của người dùng
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle sidebar khi nhấn nút
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Đóng sidebar mỗi khi chuyển trang
  useEffect(() => {
    setIsOpen(false); // Đóng sidebar khi route thay đổi
  }, [location]);
  // Thay đổi màu sidebar
  const changeSidebarColor = (color) => {
    setSidebarColor(color);
  };

  // Điều hướng đến trang tương ứng
  const handleNavigation = (path) => {
    setIsOpen(false); // Đóng sidebar khi điều hướng
    navigate(path); // Điều hướng đến trang
  };

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
      <FaBars className="menu-icon" onClick={toggleSidebar} />
      <div
        className={`sidebar ${isOpen ? "open" : ""}`}
        style={{ backgroundColor: sidebarColor }}
      >
        <div className="top-section">
          {isOpen && <img src={logo} alt="Logo" className="logo" />}
        </div>
        <div className="menu">
          <ul>
            <li className="menu-item" onClick={() => handleNavigation("/admin/dashboard")}>
              <FaClipboard />
              {isOpen && <span>Dashboard</span>}
            </li>
            <li className="menu-item" onClick={() => handleNavigation("/admin/users")}>
              <FaUserFriends />
              {isOpen && <span>Users Management</span>}
            </li>
            <li className="menu-item" onClick={() => handleNavigation("/admin/stories")}>
              <FaBook />
              {isOpen && <span>Stories Management</span>}
            </li>
            {/* <li className="menu-item" onClick={() => handleNavigation("/admin/comments")}>
              <FaComments />
              {isOpen && <span>Comments</span>}
            </li> */}
            <li className="menu-item" onClick={() => handleNavigation("/admin/report")}>
              <FaRegFlag />
              {isOpen && <span>Report Handling</span>}
            </li>
            <li className="menu-item" onClick={() => handleNavigation("/admin/management")}>
              <RiAdminFill />
              {isOpen && <span>Admin Management</span>}
            </li>
            <li className="menu-item" onClick={() => handleNavigation("/admin/settings")}>
              <IoIosSettings />
              {isOpen && <span>Settings</span>}
            </li>
          </ul>
        </div>
        <div className={`bottom ${isOpen ? "open" : ""}`}>
          <div
            className="color-option"
            onClick={() => changeSidebarColor("#ffc0cb")}
          ></div>
          <div
            className="color-option"
            onClick={() => changeSidebarColor("aquamarine")}
          ></div>
          <div
            className="color-option"
            onClick={() => changeSidebarColor("aqua")}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
