import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import book_cover from "../../image/logo/mongLogo.png";

function Genre() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tags = [
    { name: "Ngôn tình", path: "/novel/ngon-tinh" },
    { name: "Đam mỹ", path: "/novel/dam-my" },
    { name: "Xuyên không", path: "/novel/xuyen-khong" },
    { name: "Hệ thống", path: "/novel/he-thong" },
    { name: "Điền văn", path: "/novel/dien-van" },
    { name: "Ngọt sủng", path: "/novel/ngot-sung" },
    { name: "Linh dị", path: "/novel/linh-di" },
    { name: "Nữ phụ", path: "/novel/nu-phu" },
    { name: "Thế thân", path: "/novel/the-than" },
    { name: "Dân quốc", path: "/novel/dan-quoc" },
    { name: "OE", path: "/novel/oe" },
    { name: "Đô thị", path: "/novel/do-thi" },
    { name: "HE", path: "/novel/he" },
    { name: "SE", path: "/novel/se" },
    { name: "Nữ cường", path: "/novel/nu-cuong" },
    { name: "Bách hợp", path: "/novel/bach-hop" },
    { name: "Trọng sinh", path: "/novel/trong-sinh" },
    { name: "Ngược", path: "/novel/nguoc" },
    { name: "Cung đấu", path: "/novel/cung-dau" },
    { name: "Hài hước", path: "/novel/hai-huoc" },
    { name: "TXVT", path: "/novel/txvt" },
    { name: "Vả mặt", path: "/novel/va-mat" },
    { name: "Chữa lành", path: "/novel/chua-lanh" },
    { name: "Mạt thế", path: "/novel/mat-the" },
    { name: "Huyền huyễn", path: "/novel/huyen-huyen" },
    { name: "Truyện teen", path: "/novel/truyen-teen" },
    { name: "Cổ đại", path: "/novel/co-dai" },
    { name: "Hiện đại", path: "/novel/hien-dai" },
    { name: "Báo thù", path: "/novel/bao-thu" },
  ];

  // Fetch books from API based on category
  useEffect(() => {
    const fetchBooks = async (categoryPath) => {
      try {
        setLoading(true);
        const response = await fetch(`http://3.26.145.187:8000/api/stories?category_id=${categoryPath}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.items) {
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
        setError("Không thể tải danh sách truyện. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks("truyen-ngan");  // Fetch books for "Truyện ngắn" as an example
  }, []);

  // Sort books by date and rating
  const newBooks = [...books].sort((a, b) => new Date(b.date) - new Date(a.date));
  const popularBooks = [...books].sort((a, b) => b.rating - a.rating);

  const CustomPrevArrow = ({ onClick }) => {
    return (
      <button
        className="slick-prev"
        onClick={onClick}
        style={{
          display: "flex",
          position: "absolute",
          top: "50%",
          left: "-20px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(107, 105, 105, 0.5)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "20px",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 1000,
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#E53E5D")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(107, 105, 105, 0.5)")}
      ></button>
    );
  };

  const CustomNextArrow = ({ onClick }) => {
    return (
      <button
        className="slick-next"
        onClick={onClick}
        style={{
          display: "flex",
          position: "absolute",
          top: "50%",
          right: "-20px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(107, 105, 105, 0.5)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "20px",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 1000,
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#E53E5D")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(107, 105, 105, 0.5)")}
      ></button>
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const renderBookSection = (title, booksToRender) => (
    <div>
      <div className="featured-wrapper">
        <button className="bun tagbooks">
          <h2 className="section-title">{title}</h2>
        </button>
        <div className="featured-section">
          <Slider {...settings}>
            {booksToRender.map((book) => (
              <div className="book-card" key={book.id}>
                <img
                  src={book.image}
                  alt={book.title}
                  className="book-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = book_cover;
                  }}
                />
                <Link to={`/stories/${book.id}`} className="book-link">
                  <h3 className="book-title">{book.title}</h3>
                </Link>
                <div className="tags">
                  {book.tags.map((tag, i) => (
                    <span key={i} className={`tag ${tag.toLowerCase()}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="rating">⭐ {book.rating.toFixed(1)}</div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Render tags only once */}
      <div className="tag-container">
        {tags.map((tag, index) => (
          <Link key={index} to={`/${tag.path}`} className="tag-item">
            {tag.name}
          </Link>
        ))}
      </div>
      {/* Render books */}
      {renderBookSection("TIỂU THUYẾT", newBooks)}
      {renderBookSection("TIỂU THUYẾT NỔI BẬT", popularBooks)}
    </div>
  );
}

export default Genre;