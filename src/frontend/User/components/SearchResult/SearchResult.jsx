import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./SearchResult.css";
import "../NewBooks.css";
import book_cover from "../../image/logo/mongLogo.png";

function SearchResult() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`http://3.26.145.187:8000/api/stories?search=${encodeURIComponent(query)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.items) {
            // Transform the data to include necessary fields
            const transformedBooks = data.items.map(book => ({
              ...book,
              img: book.cover_image_url || book_cover,
              rating: book.average_rating || 0,
              turn: book.rating_count || 0,
              chapters: book.chapter_count || 0,
              category: book.categories?.map(cat => cat.name).join(", ") || "Chưa phân loại",
              status: book.status === "ONGOING" ? ["Đang viết"] : ["Hoàn thành"]
            }));
            setBooks(transformedBooks);
          } else {
            setBooks([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.");
        })
        .finally(() => {
          setLoading(false);
          setCurrentPage(1);
        });
    }
  }, [query]);

  // Get current books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="search-results">
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>
      <button className="bun tagbooks">
        <h2 className="section-title">TRUYỆN LIÊN QUAN</h2>
      </button>
      
      {books.length > 0 ? (
        <div className="book-list">
          {currentBooks.map((book) => (
            <div key={book.story_id} className="book-card">
              <img src={book.img} alt={book.title} className="book-image" />
              <div className="book-info">
                <div className="book-title-container">
                  <Link to={`/stories/${book.story_id}`} className="book-links">
                    <h3 className="book-title">{book.title}</h3>
                  </Link>
                </div>
                <p><strong>Tác giả:</strong> {book.author_name || "Chưa có tác giả"}</p>
                <p><strong>Danh mục:</strong> {book.category}</p>
                <p><strong>Tổng số chương:</strong> {book.chapters} chương</p>
                <p><strong>Tình trạng:</strong> {book.status.join(", ")}</p>
                <p><strong>Đánh giá:</strong> {book.rating.toFixed(1)}/5.0 ({book.turn} lượt)</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không tìm thấy kết quả nào.</p>
      )}

      {books.length > booksPerPage && (
        <div className="pagination">
          {Array.from({ length: Math.ceil(books.length / booksPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              disabled={currentPage === index + 1}
              className={currentPage === index + 1 ? "active-page" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResult;
