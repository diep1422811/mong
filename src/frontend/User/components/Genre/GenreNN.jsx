import React, { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import "./Category.css";
  import Slider from "react-slick";
  import "slick-carousel/slick/slick.css";
  import "slick-carousel/slick/slick-theme.css";
  import book_cover from "../../image/logo/mongLogo.png";
  
  function Genre() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const tags = [
      { path: "tho", name: "Thơ" },
      { path: "kich", name: "Kịch" },
      { path: "ky-ao", name: "Kỳ ảo" },
      { path: "than-thoai", name: "Thần thoại" },
      { path: "dan-gian", name: "Dân gian" },
      { path: "hien-thuc", name: "Hiện thực" },
    ];
    // Fetch books from API
    useEffect(() => {
      const fetchBooks = async () => {
        try {
          setLoading(true);
          const response = await fetch("http://3.26.145.187:8000/api/stories?category_id=3");
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data && data.items) {
            // Transform the data to include necessary fields
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
  
      fetchBooks();
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
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "#E53E5D") 
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "rgba(107, 105, 105, 0.5)") 
          }
        >
        </button>
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
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "#E53E5D") 
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "rgba(107, 105, 105, 0.5)") 
          }
        >
        </button>
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
            <Link key={index} to={tag.path} className="tag-item">
              {tag.name}
            </Link>
          ))}
        </div>
        {/* Render books */}
        {renderBookSection("VĂN HỌC NƯỚC NGOÀI MỚI", newBooks)}
        {renderBookSection("VĂN HỌC NỔI BẬT", popularBooks)}
      </div>
    );
  }
  
  export default Genre;
  