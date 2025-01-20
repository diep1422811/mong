// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Pagination from "../../components/Pagination/Pagination.jsx";
// import { MdDelete } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

// const Comments = () => {
//   const navigate = useNavigate();
//   const [comments, setComments] = useState([]);
//   const [filteredComments, setFilteredComments] = useState([]);
//   const [search, setSearch] = useState(""); // Tìm kiếm theo tên truyện
//   const [timeFilter, setTimeFilter] = useState(""); // Lọc theo thời gian
//   const [exactDate, setExactDate] = useState(""); // Lọc theo ngày chính xác
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showDeleteModal, setShowDeleteModal] = useState(false); // State for showing modal
//   const [commentToDelete, setCommentToDelete] = useState(null); // State to track the comment to delete

//   const recordsPerPage = 10;
//   const token = localStorage.getItem("token");  // Retrieve token from localStorage
//   const totalPages = Math.ceil(filteredComments.length / recordsPerPage);
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredComments.slice(indexOfFirstRecord, indexOfLastRecord);

//   // Updated fetch function with proper error handling
//   const fetchCommentsForAllStories = async () => {
//     try {
//       if (!token) {
//         navigate("/login");
//         return;
//       }
//       const storiesResponse = await axios.get("http://3.26.145.187:8000/api/stories", { headers: { Authorization: `Bearer ${token}` } });

//       // Verify stories data exists and is an array
//       if (!Array.isArray(storiesResponse.data)) {
//         console.error("Invalid stories data format:", storiesResponse.data);
//         setComments([]);
//         setFilteredComments([]);
//         return;
//       }

//       const allComments = [];
//       for (const story of storiesResponse.data) {
//         try {
//           const chaptersResponse = await axios.get(
//             `http://3.26.145.187:8000/api/stories/${story.story_id}/chapters`, { headers: { Authorization: `Bearer ${token}` } }
//           );

//           // Verify chapters data exists and is an array
//           if (!Array.isArray(chaptersResponse.data)) {
//             console.error(`Invalid chapters data for story ${story.story_id}:`, chaptersResponse.data);
//             continue;
//           }

//           for (const chapter of chaptersResponse.data) {
//             try {
//               const commentsResponse = await axios.get(
//                 `http://3.26.145.187:8000/api/stories/${story.story_id}/chapters/${chapter.chapter_id}/comments`, { headers: { Authorization: `Bearer ${token}` } }
//               );

//               // Verify comments data exists and is an array
//               if (Array.isArray(commentsResponse.data)) {
//                 // Add story name to each comment
//                 const commentsWithStoryName = commentsResponse.data.map(comment => ({
//                   ...comment,
//                   storyName: story.title || 'Unknown Story'
//                 }));
//                 allComments.push(...commentsWithStoryName);
//               }
//             } catch (commentError) {
//               console.error(`Error fetching comments for chapter ${chapter.chapter_id}:`, commentError);
//             }
//           }
//         } catch (chapterError) {
//           console.error(`Error fetching chapters for story ${story.story_id}:`, chapterError);
//         }
//       }

//       setComments(allComments);
//       setFilteredComments(allComments);
//     } catch (error) {
//       console.error("Error fetching stories:", error);
//       setComments([]);
//       setFilteredComments([]);
//     }
//   };

//   useEffect(() => {
//     fetchCommentsForAllStories();
//   }, []); // Fetch when the component mounts

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleTimeFilter = (filterOption) => {
//     setTimeFilter(filterOption);
//     let filtered = comments;
//     const currentDate = new Date();

//     switch (filterOption) {
//       case "today":
//         const today = currentDate.toISOString().split("T")[0]; // Định dạng YYYY-MM-DD
//         filtered = filtered.filter(comment => comment.createdAt === today);
//         break;
//       case "thisWeek":
//         const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 6);

//         filtered = filtered.filter((comment) => {
//           const commentDate = new Date(comment.createdAt);
//           return commentDate >= startOfWeek && commentDate <= endOfWeek;
//         });
//         break;
//       case "thisMonth":
//         const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         filtered = filtered.filter((comment) => {
//           const commentDate = new Date(comment.createdAt);
//           return commentDate >= startOfMonth;
//         });
//         break;
//       case "thisYear":
//         const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
//         filtered = filtered.filter((comment) => {
//           const commentDate = new Date(comment.createdAt);
//           return commentDate >= startOfYear;
//         });
//         break;
//       case "exactDate":
//         if (exactDate) {
//           filtered = filtered.filter(comment => comment.createdAt === exactDate);
//         }
//         break;
//       default:
//         break;
//     }

//     setFilteredComments(filtered);
//     setCurrentPage(1); // Reset to first page when applying filter
//   };

//   const handleSearch = () => {
//     let filtered = comments.filter(comment =>
//       comment.storyName.toLowerCase().includes(search.toLowerCase())
//     );
//     setFilteredComments(filtered);
//     setCurrentPage(1); // Reset to first page after search
//   };

//   const handleDelete = async (id) => {
//     try {
//       const comment = comments.find(c => c.id === id);
//       if (!comment) {
//         console.error("Comment not found");
//         return;
//       }

//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       await axios.delete(
//         `http://3.26.145.187:8000/api/stories/${comment.story_id}/chapters/${comment.chapter_id}/comments/${id}`, { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const updatedComments = comments.filter((comment) => comment.comment_id !== id);
//       setComments(updatedComments);
//       setFilteredComments(updatedComments);
//       setShowDeleteModal(false);
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     }
//   };

//   const openDeleteModal = (id) => {
//     setCommentToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const closeDeleteModal = () => {
//     setShowDeleteModal(false);
//   };

//   const handleExactDateChange = (e) => {
//     setExactDate(e.target.value);
//   };

//   const handleExactDateFilter = (e) => {
//     if (e.key === "Enter") {
//       handleTimeFilter("exactDate");
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Comments Management</h1>
//       <div className="searchb">
//         <input
//           type="text"
//           placeholder="Search by story name"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button onClick={handleSearch}>Search</button>
//       </div>

//       <div className="filter-containe">
//         <select value={timeFilter} onChange={(e) => handleTimeFilter(e.target.value)}>
//           <option value="">Filter by Date</option>
//           <option value="today">Today</option>
//           <option value="thisWeek">This Week</option>
//           <option value="thisMonth">This Month</option>
//           <option value="thisYear">This Year</option>
//           <option value="exactDate">Exact Date</option>
//         </select>

//         {timeFilter === "exactDate" && (
//           <input
//             type="date"
//             value={exactDate}
//             onChange={handleExactDateChange}
//             onKeyDown={handleExactDateFilter}
//           />
//         )}
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Content</th>
//             <th>User ID</th>
//             <th>Chapter ID</th>
//             <th>Created At</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.length > 0 ? (
//             currentRecords.map((comment) => (
//               <tr key={comment.comment_id}>
//                 <td>{comment.comment_id}</td>
//                 <td>{comment.content}</td>
//                 <td>{comment.user_id}</td>
//                 <td>{comment.chapter_id}</td>
//                 <td>{comment.created_at}</td>
//                 <td>
//                   <button
//                     className="icon"
//                     onClick={() => openDeleteModal(comment.comment_id)} // Open the modal on delete click
//                   >
//                     <MdDelete />
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7">No results found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//       />

//       {showDeleteModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Do you want to delete this comment?</h3>
//             <button onClick={() => handleDelete(commentToDelete)} className="confirm-btn">
//               Yes
//             </button>
//             <button onClick={closeDeleteModal} className="cancel-btn">
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Comments;
