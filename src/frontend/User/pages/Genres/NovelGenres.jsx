import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Genres.css";
import book_cover from "../../image/logo/mongLogo.png";

function NovelGenres() {
  const { tag } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the tag ID based on the tag name
        const tagId = getTagId(tag);
        if (!tagId) {
          throw new Error("Thể loại không hợp lệ");
        }

        const response = await fetch(
          `http://3.26.145.187:8000/api/stories?category_id=1&tag_id=${tagId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.items) {
          // Transform the data
          const transformedBooks = data.items.map(book => ({
            ...book,
            image: book.cover_image_url || book_cover,
            rating: book.average_rating || 0,
            tags: book.categories?.map(cat => cat.name) || [],
            id: book.story_id,
            date: book.created_at || new Date().toISOString()
          }));
          setBooks(transformedBooks);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Có lỗi khi tải dữ liệu sách. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [tag]);

  // Helper function to get tag ID from tag name
  const getTagId = (tagName) => {
    const tagMap = {
      "ngon-tinh": 22,
      "dam-my": 23,
      "xuyen-khong": 24,
      "he-thong": 25,
      "dien-van": 26,
      "ngot-sung": 27,
      "linh-di": 28,
      "nu-phu": 29,
      "the-than": 30,
      "dan-quoc": 31,
      "oe": 32,
      "do-thi": 33,
      "he": 34,
      "se": 35,
      "nu-cuong": 36,
      "bach-hop": 37,
      "trong-sinh": 38,
      "nguoc": 39,
      "cung-dau": 40,
      "hai-huoc": 41,
      "txvt": 42,
      "va-mat": 43,
      "chua-lanh": 44,
      "mat-the": 45,
      "huyen-huyen": 46,
      "truyen-teen": 47,
      "co-dai": 48,
      "hien-dai": 49,
      "bao-thu": 50
    };
    return tagMap[tagName];
  };

  // Helper function to format tag name for display
  const formatTagName = (tagName) => {
    const displayNames = {
      "ngon-tinh": "Ngôn Tình",
      "dam-my": "Đam Mỹ",
      "xuyen-khong": "Xuyên Không",
      // ... add other tag name mappings
    };
    return displayNames[tagName] || tagName;
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (books.length === 0) {
    return <div className="no-books">Không tìm thấy truyện nào thuộc thể loại này.</div>;
  }

  return (
    <div className="genre-page">
      <h1 className="genre-title">Thể loại: {formatTagName(tag)}</h1>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img 
              src={book.image} 
              alt={book.title} 
              className="book-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = book_cover;
              }}
            />
            <div className="book-info">
              <Link to={`/stories/${book.id}`} className="book-title">
                {book.title}
              </Link>
              <p className="book-author">{book.author_name || "Chưa có tác giả"}</p>
              <div className="book-tags">
                {book.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="book-rating">⭐ {book.rating.toFixed(1)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NovelGenres; 