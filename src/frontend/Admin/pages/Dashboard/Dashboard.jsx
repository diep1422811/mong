import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import DashboardChart from "./DashboardChart.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";

const Dashboard = () => {
  const [newUsers, setNewUsers] = useState([]);
  const [newStories, setNewStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1); // Trang cho người dùng
  const storiesPerPage = 10;
  const usersPerPage = 5; // Số người dùng hiển thị trên mỗi trang

  const fetchRecentData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch("http://3.26.145.187:8000/api/dashboard/recent", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();
      console.log("API Data:", data);
      setNewUsers(data.recent_users || []);
      setNewStories(data.recent_stories || []);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  useEffect(() => {
    fetchRecentData();
  }, []);

  useEffect(() => {
    console.log("New Users:", newUsers);  // Kiểm tra dữ liệu người dùng
    console.log("New Stories:", newStories);  // Kiểm tra dữ liệu truyện
  }, [newUsers, newStories]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUserPageChange = (page) => {
    setCurrentUserPage(page);  // Thay đổi trang người dùng
  };

  // Calculate total pages based on the number of stories and users
  const totalPages = Math.ceil(newStories.length / storiesPerPage);
  const totalUserPages = Math.ceil(newUsers.length / usersPerPage); // Tính tổng số trang người dùng

  // Get the stories and users for the current page
  const paginatedStories = newStories.slice(
    (currentPage - 1) * storiesPerPage,
    currentPage * storiesPerPage
  );
  const paginatedUsers = newUsers.slice(
    (currentUserPage - 1) * usersPerPage,
    currentUserPage * usersPerPage
  );

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="overview">
        <div className="left">
          <DashboardChart />
          <div className="statistics">
            <p style={{ color: "brown", fontSize: "20px", fontWeight: "bold" }}>
              New Stories in Last 24 Hours
            </p>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Create At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStories.map((story) => (
                  <tr key={story.story_id}>
                    <td>{story.story_id}</td>
                    <td>{story.title}</td>
                    <td>{story.author_name}</td>
                    <td>{new Date(story.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <div className="right">
          <p style={{ color: "brown", fontSize: "20px", fontWeight: "bold" }}>
            Update
          </p>
          <div
            style={{
              background: "#99d9f2",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              border: "2px solid #68c9f2",
              maxWidth: "600px",
              margin: "20px auto",
              fontFamily: "'Roboto', sans-serif",
              color: "#333",
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={{ color: "#006d9f", fontSize: "1.5rem", marginBottom: "10px" }}>
              New Users Notification
            </h3>
            {newUsers.length === 0 ? (
              <p style={{ color: "#555", fontSize: "1.2rem", fontStyle: "italic" }}>
                No new users found.
              </p>
            ) : (
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                {paginatedUsers.map((user, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "10px",
                      marginBottom: "8px",
                      backgroundColor: "#e3f7ff",
                      borderRadius: "8px",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d3f0ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e3f7ff")}
                  >
                    <strong>{user.username}</strong> đã tham gia vào nền tảng lúc{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
            <Pagination
              currentPage={currentUserPage} // Trang hiện tại cho người dùng
              totalPages={totalUserPages} // Tổng số trang người dùng
              onPageChange={handleUserPageChange} // Hàm thay đổi trang
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
