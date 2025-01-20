import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { MdDelete } from "react-icons/md";
import { GiTeamUpgrade } from "react-icons/gi";
import "./AdminManagement.css";

const AdminManagement = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const [currentAddPage, setCurrentAddPage] = useState(1);
    const recordsPerPageAdd = 5;
    const totalAddPages = Math.ceil(users.length / recordsPerPageAdd);
    const currentAddRecords = users.slice(
        (currentAddPage - 1) * recordsPerPageAdd,
        currentAddPage * recordsPerPageAdd
    );

    const handleAddPageChange = (page) => {
        setCurrentAddPage(page);
    };

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await axios.get('http://3.26.145.187:8000/api/superadmin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data?.users) {
                    const adminUsers = response.data.users.filter(user => user.role === "ADMIN");
                    setAdmins(adminUsers);
                }
            } catch (error) {
                console.error("Error fetching admins:", error);
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            }
        };

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await axios.get('http://3.26.145.187:8000/api/superadmin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data?.users) {
                    const nonAdminUsers = response.data.users.filter(user => user.role === "USER");
                    setUsers(nonAdminUsers);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            }
        };

        fetchAdmins();
        fetchUsers();
    }, [navigate]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const openDeleteModal = (adminId) => {
        setAdminToDelete(adminId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setAdminToDelete(null);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            await axios.patch(`http://3.26.145.187:8000/api/superadmin/users/${adminToDelete}/role`,
                { role: 'USER' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Cập nhật lại danh sách admin và user
            const updatedAdmins = admins.filter(admin => admin.user_id !== adminToDelete);
            setAdmins(updatedAdmins);

            const demotedAdmin = admins.find(admin => admin.user_id === adminToDelete);
            if (demotedAdmin) {
                setUsers([...users, { ...demotedAdmin, role: 'USER' }]);
            }

            closeDeleteModal();
        } catch (error) {
            console.error("Error changing admin role:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    const grantAdmin = async (userId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const userToPromote = users.find(user => user.user_id === userId);
            if (userToPromote) {
                const response = await axios.patch(
                    `http://3.26.145.187:8000/api/superadmin/users/${userId}/role`,
                    { role: 'ADMIN' },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const newAdmin = { ...response.data, role: 'ADMIN' };
                setAdmins([...admins, newAdmin]);
                setUsers(users.filter(user => user.id !== userId));

                closeAddModal();
                alert("Grant Admin Successfully!!")
            }
        } catch (error) {
            console.error("Error granting admin role:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    const totalPages = Math.ceil(admins.length / recordsPerPage);
    const currentRecords = admins.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <div className="container">
            <h1>Admin Management</h1>

            <button className="add-button" onClick={openAddModal}>Add</button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((admin) => (
                        <tr key={admin.user_id}>
                            <td>{admin.user_id}</td>
                            <td>{admin.username}</td>
                            <td>{admin.email}</td>
                            <td>
                                <button onClick={() => openDeleteModal(admin.user_id)}>
                                    <MdDelete />
                                </button>
                            </td>
                            <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to demote this admin to a regular user?</p>
                        <button className="yes-button" onClick={handleDelete}>Yes</button>
                        <button className="close-button" onClick={closeDeleteModal}>Cancel</button>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Promote User to Admin</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAddRecords.map((user) => (
                                    <tr key={user.user_id}>
                                        <td>{user.user_id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button onClick={() => grantAdmin(user.user_id)}>
                                                <GiTeamUpgrade /> Promote
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentAddPage}
                            totalPages={totalAddPages}
                            onPageChange={handleAddPageChange}
                        />
                        <button className="close-button" onClick={closeAddModal}>Close</button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default AdminManagement;
