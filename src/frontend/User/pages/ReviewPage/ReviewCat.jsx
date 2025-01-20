import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import book_cover from "../../../User/image/logo/mongLogo.png";
import { Link } from "react-router-dom";

function NewBooks() {
  const [novels, setNovels] = useState([]); // Tiểu thuyết (category_id: 1)
  const [vietnameseLiterature, setVietnameseLiterature] = useState([]); // Văn học VN (category_id: 2)
  const [foreignLiterature, setForeignLiterature] = useState([]); // Văn học nước ngoài (category_id: 3)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const responses = await Promise.all([
          fetch('http://3.26.145.187:8000/api/stories?category_id=1'),
          fetch('http://3.26.145.187:8000/api/stories?category_id=2'),
          fetch('http://3.26.145.187:8000/api/stories?category_id=3')
        ]);

        const [novelsData, vnLitData, foreignLitData] = await Promise.all(
          responses.map(async response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.items || [];
          })
        );

        // Transform the data
        const transformBooks = books => books.map(book => ({
          ...book,
          image: book.cover_image_url || book_cover,
          rating: book.average_rating || 0,
          tags: book.categories?.map(cat => cat.name) || [],
          id: book.story_id
        }));

        setNovels(transformBooks(novelsData));
        setVietnameseLiterature(transformBooks(vnLitData));
        setForeignLiterature(transformBooks(foreignLitData));
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Không thể tải danh sách truyện. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = "#E53E5D")
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = "rgba(107, 105, 105, 0.5)")
        }
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

  const renderBookSection = (title, books) => (
    <div className="featured-wrapper">
      <button className="bun tagbooks">
        <h2 className="section-title">{title}</h2>
      </button>
      <div className="featured-section">
        <Slider {...settings}>
          {books.map((book) => (
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
              <Link to={`/review/${book.id}`} className="book-link">
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
  );

  return (
    <div>
      {renderBookSection("TIỂU THUYẾT", novels)}
      {renderBookSection("VĂN HỌC VIỆT NAM", vietnameseLiterature)}
      {renderBookSection("VĂN HỌC NƯỚC NGOÀI", foreignLiterature)}
    </div>
  );
}

export default NewBooks;
