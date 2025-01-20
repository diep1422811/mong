import React, { useState, useEffect } from "react";
import axios from "axios";
import { LuHistory } from "react-icons/lu";
import { MdOutlineCircleNotifications, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // New state to store the selected status
  const [filteredReports, setFilteredReports] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); 
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [sentContent, setSentContent] = useState(""); 
  const [reasons] = useState([
    "Inappropriate content",
    "Plagiarism",
    "Offensive language",
    "Spam",
  ]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchId, statusFilter]); // Trigger search/filter when searchId or statusFilter changes

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get("http://3.26.145.187:8000/api/reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data.items);
      setFilteredReports(response.data.items); // Initially set filteredReports
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleSearch = () => {
    let result = reports;

    if (searchId) {
      result = result.filter((report) => report.report_id.toString().includes(searchId));
    }

    if (statusFilter) {
      result = result.filter((report) => report.status === statusFilter);
    }

    setFilteredReports(result);
  };

  const handleSendNotification = (reportId) => {
    setSelectedReportId(reportId);
    setPopupType("notification");
    setShowPopup(true);
  };

  const handleViewSentContent = (reportId) => {
    const report = reports.find((r) => r.report_id === reportId);
    setSentContent(report.email_content || "No content available.");
    setPopupType("view");
    setShowPopup(true);
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        await axios.delete(`http://3.26.145.187:8000/api/reports/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Report deleted successfully!");
        fetchReports();
      } catch (error) {
        console.error("Error deleting report:", error);
      }
    }
  };

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
  };

  const handleSendNotificationContent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.patch(`http://3.26.145.187:8000/api/reports/${selectedReportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }, {
        status: "COMPLETED", 
        email_content: selectedReason, 
      });
      alert("Notification sent to author!");
      setShowPopup(false); 
      fetchReports(); 
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div className="container">
      <h1>Reports Management</h1>
      <div className="searchb">
        <input
          type="text"
          placeholder="Search by Report ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <div className="filter-containe">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Filter by Status</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            {/* Add more status options as needed */}
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Reason</th>
            <th>Reporter</th>
            <th>Chapter</th>
            <th>Story</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.report_id}>
              <td>{report.report_id}</td>
              <td>{report.reason}</td>
              <td>{report.reporter.name}</td>
              <td>{report.story.chapter}</td>
              <td>{report.story.title}</td>
              <td>{new Date(report.created_at).toLocaleString()}</td>
              <td>{report.status}</td>
              <td>
                {report.status === "in_progress" ? (
                  <button onClick={() => handleSendNotification(report.report_id)}>
                    <MdOutlineCircleNotifications />
                  </button>
                ) : (
                  <button onClick={() => handleViewSentContent(report.report_id)}>
                    <LuHistory />
                  </button>
                )}
                <button onClick={() => handleDeleteReport(report.report_id)}><MdDelete /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && popupType === "notification" && (
        <div className="modal">
          <h3>Select a reason to notify the author</h3>
          {reasons.map((reason, index) => (
            <button
              key={index}
              onClick={() => handleReasonSelect(reason)}
              className={selectedReason === reason ? "selected" : ""}
            >
              {reason}
            </button>
          ))}
          <button onClick={handleSendNotificationContent}>Send</button>
          <button onClick={() => setShowPopup(false)}>Cancel</button>
        </div>
      )}

      {showPopup && popupType === "view" && (
        <div className="modal">
          <h3>Sent Notification Content</h3>
          <p>{sentContent}</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Report;
