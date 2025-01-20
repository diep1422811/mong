import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination.jsx";
import "./Categories.css";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("asc");
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });

    // Modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const recordsPerPage = 10;
    const totalPages = Math.ceil(filteredCategories.length / recordsPerPage);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredCategories.slice(indexOfFirstRecord, indexOfLastRecord);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://3.26.145.187:8000/api/categories");
                setCategories(response.data);
                setFilteredCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = () => {
        const result = categories.filter((category) =>
            category.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCategories(result);
    };

    const handleSort = (order) => {
        setSortOrder(order);
        const sortedCategories = [...filteredCategories].sort((a, b) => {
            return order === "asc" ? a.story_count - b.story_count : b.story_count - a.story_count;
        });
        setFilteredCategories(sortedCategories);
    };

    const handleAddCategory = async () => {
        if (!newCategory.name.trim() || !newCategory.description.trim()) {
            alert("Name and Description are required!");
            return;
        }

        try {
            const newCategoryItem = {
                name: newCategory.name.trim(),
                description: newCategory.description.trim(),
            };
            const response = await axios.post("http://3.26.145.187:8000/api/categories", newCategoryItem);
            setCategories((prevCategories) => [...prevCategories, response.data]);
            setFilteredCategories((prevFiltered) => [...prevFiltered, response.data]);
            setNewCategory({ name: "", description: "" });
            alert("Category added successfully!");
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const openDeleteModal = (categoryId) => {
        setCategoryToDelete(categoryId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setCategoryToDelete(null);
    };

    const handleDelete = async () => {
        try {
            // Proceed with deletion
            await axios.delete(`http://3.26.145.187:8000/api/categories/${categoryToDelete}`);
    
            // Remove the category from both the categories and filteredCategories states
            setCategories((prevCategories) => prevCategories.filter((category) => category.category_id !== categoryToDelete));
            setFilteredCategories((prevFiltered) => prevFiltered.filter((category) => category.category_id !== categoryToDelete));
    
            // Close the modal after deletion
            closeDeleteModal();
            alert("Category deleted successfully!");
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("An error occurred while deleting the category. Please try again.");
        }
    };
    

    return (
        <div className="container">
            {/* Search Bar */}
            <div className="searchb">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Sort Buttons */}
            <div className="sort-container">
                <button onClick={() => handleSort("asc")}>Low to High</button>
                <button onClick={() => handleSort("desc")}>High to Low</button>
            </div>

            {/* Add Category Form */}
            <div className="ad-form">
                <input
                    type="text"
                    placeholder="Category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
                <button onClick={handleAddCategory} className="add-btn">Add</button>
            </div>

            {/* Category Table */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Story_count</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((category) => (
                        <tr key={category.category_id}>
                            <td>{category.category_id}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>{category.story_count}</td>
                            <td>
                                <button
                                    className="icon"
                                    onClick={() => openDeleteModal(category.category_id)}
                                >
                                    <MdDelete />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Do you want to delete this category?</h3>
                        <p>
                            <strong>
                                {categories.find((cat) => cat.category_id === categoryToDelete)?.name}
                            </strong>
                        </p>
                        <button onClick={handleDelete} className="confirm-btn">
                            Yes
                        </button>
                        <button onClick={closeDeleteModal} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
