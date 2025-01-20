import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import removeAccents from "remove-accents"; // Thư viện loại bỏ dấu
import "./Genre.css";

// Dữ liệu truyện
import book1 from "../../image/book/book1.jpg";
import book2 from "../../image/book/book2.jpeg";
import book3 from "../../image/book/book3.jpg";
import book4 from "../../image/book/book4.jpg";

const books = [
  {
    id: 1,
    title: "Đảo Mộng Mơ",
    image: book1,
    genre: "Hồi ký",
    tags: ["FULL", "HOT"],
    rating: 5.0,
    author: "Tác giả A",
    category: "Hiện đại",
    chapters: 20,
    status: "Hoàn thành",
  },
  {
    id: 2,
    title: "Cuộc Sống Giống Cuộc Đời",
    image: book2,
    genre: "Truyện ngắn",
    tags: ["FULL", "HOT"],
    rating: 5.0,
    author: "Tác giả B",
    category: "Ngôn tình",
    chapters: 30,
    status: "Hoàn thành",
  },
  {
    id: 3,
    title: "Người Mẹ Lặng Thầm",
    image: book3,
    genre: "Lãng mạn",
    tags: ["FULL", "HOT"],
    rating: 4.9,
    author: "Tác giả C",
    category: "Ngôn tình",
    chapters: 15,
    status: "Hoàn thành",
  },
  {
    id: 4,
    title: "Hãy Khiến Tương Lai Của Bạn",
    image: book4,
    genre: "Kinh dị",
    tags: ["HOT"],
    rating: 4.8,
    author: "Tác giả D",
    category: "Ngôn tình",
    chapters: 10,
    status: "Đang cập nhật",
  },
];

const genreMap = {
  "truyen ngan": "Truyện ngắn",
  "lang man": "Lãng mạn",
  "kinh di": "Kinh dị",
  "gia tuong": "Giả tưởng",
  "hoi ky": "Hồi ký",
  "phieu luu": "Phiêu lưu",
};

function VNGenres() {
  const { tag } = useParams(); // Lấy giá trị tag từ URL
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const booksPerPage = 8; // Số sách mỗi trang

  // Chuyển đổi tag từ URL thành không dấu và thay gạch nối thành khoảng trắng
  const formattedTag = removeAccents(tag.replace(/-/g, " ").trim().toLowerCase());
  console.log("Formatted Tag:", formattedTag);

  // Lọc sách theo genre
  const filteredBooks = books.filter(
    (book) =>
      removeAccents(book.genre.replace(/\s+/g, " ").toLowerCase()) === formattedTag
  );

  // Tính toán sách hiển thị cho trang hiện tại
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Tính số trang
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Lấy tag có dấu từ genreMap (nếu không có thì hiển thị tag gốc)
  const genreWithAccent = genreMap[formattedTag] || tag;

  // Hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="search-results">
      <div className="tag-page">
        <div className="breadcrumb">
                  <Link to="/vanhocVn" className="breadcrumb-link">
                  <span className="breadcrumb-current">VĂN HỌC VIỆT NAM</span>
                  </Link>
                  <span className="breadcrumb-separator">/</span>
                  <a
                    href="#"
                    className="breadcrumb-link"
                    onClick={(e) => {
                      e.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>
                      window.location.reload(); // Reload lại trang hiện tại
                    }}
                  >
                    <span className="breadcrumb-current">{genreWithAccent}</span>
                  </a>
                </div>
      </div>

      <div className="book-list">
        {currentBooks.length > 0 ? (
          currentBooks.map((book, index) => (
            <div className="book-card" key={book.id}>
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-info">
                <div className="book-title-container">
                  <Link to={`/gioi-thieu/${book.id}`} className="book-links">
                    <h3 className="book-title">{book.title}</h3>
                  </Link>
                </div>
                <div className="tags">
                  {book.tags.map((tag, i) => (
                    <span key={i} className={`tag ${tag.toLowerCase()}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="rating">⭐ {book.rating.toFixed(1)}</div>
                <p>
                  <strong>Tác giả:</strong> {book.author}
                </p>
                <p>
                  <strong>Danh mục:</strong> {book.category}
                </p>
                <p>
                  <strong>Tổng số chương:</strong> {book.chapters} chương
                </p>
                <p>
                  <strong>Tình trạng:</strong> {book.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Không có truyện nào thuộc thể loại này.</p>
        )}
      </div>

      {/* Phân trang */}
      {filteredBooks.length > booksPerPage && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
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

      <Link to="/" className="back-button">
        ← Quay lại
      </Link>
    </div>
  );
}

export default VNGenres;
