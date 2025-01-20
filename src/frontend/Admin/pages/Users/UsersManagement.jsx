import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UsersManagement.css";
import { MdDelete } from "react-icons/md";
import { BsFillPersonVcardFill } from "react-icons/bs";
import Pagination from "../../components/Pagination/Pagination.jsx";

const UsersManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createdAtFilter, setCreatedAtFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // New States for User Details Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const recordsPerPage = 7;

  // Fetch users from backend using Axios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get(
          `http://3.26.145.187:8000/api/admin/users`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUsers(response.data);
        setFilteredUsers(response.data); // Apply initial data to filtered list
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, [navigate]); // Empty dependency array to fetch once

  // Apply search, status, and sort filter
  useEffect(() => {
    let filtered = [...users];

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((user) => user.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort by created date
    if (createdAtFilter) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if (createdAtFilter === "Newest") {
          return dateB - dateA; // Descending
        } else if (createdAtFilter === "Oldest") {
          return dateA - dateB; // Ascending
        }
        return 0;
      });
    }
    
    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.user_id.toString().includes(search)
      );
    }

    setFilteredUsers(filtered);
  }, [search, statusFilter, createdAtFilter, users]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const toggleStatus = async (userId, currentStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const newStatus = currentStatus === "Active" ? "Disabled" : "Active";
      const response = await axios.patch(
        `http://3.26.145.187:8000/api/admin/users/${userId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.user_id === updatedUser.user_id ? updatedUser : user))
      );
      setFilteredUsers((prevFiltered) =>
        prevFiltered.map((user) => (user.user_id === updatedUser.user_id ? updatedUser : user))
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const openDeleteModal = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const openDetailsModal = (user) => {
    setUserDetails(user);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setUserDetails(null);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.delete(`http://3.26.145.187:8000/api/admin/users/${userToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userToDelete));
      setFilteredUsers((prevFiltered) =>
        prevFiltered.filter((user) => user.user_id !== userToDelete)
      );
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="container">
      <h1>Users Management</h1>
      <div className="searchb">
        <input
          type="text"
          placeholder="Search by name or id..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-containe">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
        </select>

        <select value={createdAtFilter} onChange={(e) => setCreatedAtFilter(e.target.value)}>
          <option value="">Sort</option>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Last Login</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage).map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => toggleStatus(user.user_id, user.status)}>
                  {user.status === "Active" ? "Disable" : "Activate"}
                </button>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>{user.last_login ? new Date(user.last_login).toLocaleDateString() : "N/A"}</td>
              <td>
                <button onClick={() => openDeleteModal(user.user_id)}><MdDelete /></button>
                <button onClick={() => openDetailsModal(user)}><BsFillPersonVcardFill /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* User Details Modal */}
      {showDetailsModal && userDetails && (
        <div className="modal">
          <div className="modal-content">
            <h2>User Details</h2>
            <p><strong>ID:</strong> {userDetails.user_id}</p>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Status:</strong> {userDetails.status}</p>
            <p><strong>Created At:</strong> {new Date(userDetails.createdAt).toLocaleDateString()}</p>
            <button className="cancel-btn" onClick={closeDetailsModal}>Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this user?</h2>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleDelete}>Yes</button>
              <button className="cancel-btn" onClick={closeDeleteModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
