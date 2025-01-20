import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination.jsx";
import "./ListOfStories.css";
import { MdDelete, MdReport, MdMenuBook } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListOfStories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedStoryReports, setSelectedStoryReports] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);

  const recordsPerPage = 10;

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const params = {
        skip: (currentPage - 1) * recordsPerPage,
        limit: recordsPerPage,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await axios.get("http://3.26.145.187:8000/api/stories", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      console.log(response.data.items); // Log the fetched stories to verify
      setStories(response.data.items);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get("http://3.26.145.187:8000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchReports = async (storyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get(`http://3.26.145.187:8000/api/reports/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedStoryReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const applyFilters = () => {
    let filtered = stories;

    if (search) {
      filtered = filtered.filter((story) =>
        story.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((story) => story.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter((story) => story.category === categoryFilter);
    }

    setFilteredStories(filtered);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  useEffect(() => {
    fetchStories();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, categoryFilter, stories]);

  const totalPages = Math.ceil(filteredStories.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredStories.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openDeleteModal = (storyId) => {
    setStoryToDelete(storyId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setStoryToDelete(null);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.delete(`http://3.26.145.187:8000/api/stories/${storyToDelete}`, { headers: { Authorization: `Bearer ${token}` } });
      // Optimistically remove the deleted story
      setStories(stories.filter((story) => story.story_id !== storyToDelete));
      setFilteredStories(filteredStories.filter((story) => story.story_id !== storyToDelete));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const openDetailModal = (story) => {
    setSelectedStory(story);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedStory(null);
  };

  const openReportModal = (story) => {
    setSelectedStory(story);
    fetchReports(story.story_id); // Lấy các báo cáo của câu chuyện
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedStoryReports([]);
    setSelectedStory(null);
  };

  return (
    <div className="container">
      <div className="searchb">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Tìm kiếm ngay khi người dùng nhập
        />
      </div>

      <div className="filter-containe">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)} // Lọc ngay khi thay đổi trạng thái
        >
          <option value="">Select Status</option>
          <option value="ONGOING">ONGOING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="DROPPED">DROPPED</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)} // Lọc ngay khi thay đổi category
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((story) => (
              <tr key={story.story_id}>
                <td>{story.story_id}</td>
                <td>{story.title}</td>
                <td>{story.status}</td>
                <td>
                  <button onClick={() => openDetailModal(story)}>
                    <MdMenuBook />
                  </button>
                  <button onClick={() => openDeleteModal(story.story_id)}>
                    <MdDelete />
                  </button>
                  <button onClick={() => openReportModal(story)}>
                    <MdReport />
                  </button>
                </td>
                <td>{new Date(story.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No stories available at the moment.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Do you want to delete this story?</h3>
            <button onClick={handleDelete} className="confirm-btn">Yes</button>
            <button onClick={closeDeleteModal} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      {showDetailModal && selectedStory && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Story Details</h3>
            <p><strong>Title:</strong> {selectedStory.title}</p>
            <p><strong>Category:</strong> {selectedStory.category}</p>
            <p><strong>Status:</strong> {selectedStory.status}</p>
            <p><strong>Created At:</strong> {new Date(selectedStory.createdAt).toLocaleString()}</p>
            <button onClick={closeDetailModal} className="cancel-btn">Close</button>
          </div>
        </div>
      )}

      {showReportModal && selectedStoryReports.length > 0 && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reports for Story "{selectedStory.title}"</h3>
            <ul>
              {selectedStoryReports.map((report) => (
                <li key={report.report_id}>
                  <p><strong>Reason:</strong> {report.reason}</p>
                  <p><strong>Status:</strong> {report.status}</p>
                  <p><strong>Admin Note:</strong> {report.admin_note || "None"}</p>
                  <hr />
                </li>
              ))}
            </ul>
            <button onClick={closeReportModal} className="cancel-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfStories;
