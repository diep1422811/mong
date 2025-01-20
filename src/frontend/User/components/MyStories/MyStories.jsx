import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./MyStories.css";
import cover from "../../image/logo/mongLogo.png";

function MyStories() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyStories = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setError(null);
        const response = await fetch(
          "http://3.26.145.187:8000/api/users/me/stories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const transformedBooks = (data.items || []).map(book => ({
          ...book,
          rating: book.rating || 0,
          turn: book.turn || 0,
          chapters: book.chapters || 0,
          category: book.category || 'Chưa phân loại'
        }));
        setBooks(transformedBooks);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setError("Không thể tải danh sách truyện. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyStories();
  }, [navigate]);

  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBook) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setError(null);
      const response = await fetch(
        `http://3.26.145.187:8000/api/stories/${selectedBook.story_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book.story_id !== selectedBook.story_id));
      setDeletePopup(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Error deleting story:", error);
      setError("Không thể xóa truyện. Vui lòng thử lại sau.");
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="search-results">
      <button className="bun tagbooks"><h2 className="section-title">KHO CỦA TÔI</h2></button>

      {error && <div className="error-message">{error}</div>}

      {books.length > 0 ? (
        <div className="book-list">
          {books.map((book) => (
            <div key={book.story_id} className="book-card">
              <img
                src={book.cover_image_url || cover}
                alt={book.title}
                className="book-image"
                onClick={() => navigate(`/stories/${book.story_id}`)}
              />
              <div className="book-info">
                <div className="book-title-container">
                  <Link to={`/gioi-thieu/${book.story_id}`} className="book-links">
                    <h3 className="book-title">{book.title}</h3>
                  </Link>
                </div>
                <p><strong>Tác giả:</strong> {book.author_name || 'Chưa có tác giả'}</p>
                <p><strong>Danh mục:</strong> {book.category}</p>
                <p><strong>Tổng số chương:</strong> {book.chapters} chương</p>
                <p><strong>Tình trạng:</strong> {book.status === "ONGOING" ? "Đang viết" : "Hoàn thành"}</p>
                <p><strong>Đánh giá:</strong> {(book.rating || 0).toFixed(1)}/5.0 ({book.turn || 0} lượt)</p>
                <div className="book-actions">
                  <FaEdit
                    className="icon edit-icon"
                    onClick={() => navigate(`/editStory/${book.story_id}`)}
                    title="Chỉnh sửa"
                  />
                  <FaTrash
                    className="icon delete-icon"
                    onClick={() => handleDeleteClick(book)}
                    title="Xóa"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-stories">Bạn chưa đăng truyện nào.</p>
      )}

      {deletePopup && selectedBook && (
        <div className="popup">
          <div className="popup-content">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa truyện "{selectedBook.title}"?</p>
            <div className="popup-actions">
              <button className="btn confirm" onClick={handleConfirmDelete}>
                Xác nhận
              </button>
              <button
                className="btn cancel"
                onClick={() => {
                  setDeletePopup(false);
                  setSelectedBook(null);
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyStories;
