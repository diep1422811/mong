import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Category.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

function Genre() {
  const [books, setBooks] = useState([]); // State để lưu trữ danh sách sách
  const [loading, setLoading] = useState(true); // Trạng thái loading

  const tags = [
    { name: "Ngôn tình", path: "./ngon-tinh" },
    { name: "Đam mỹ", path: "./dam-my" },
    { name: "Xuyên không", path: "./xuyen-khong" },
    { name: "Hệ thống", path: "./he-thong" },
    { name: "Điền văn", path: "./dien-van" },
    { name: "Ngọt sủng", path: "./ngot-sung" },
    { name: "Linh dị", path: "./linh-di" },
    { name: "Nữ phụ", path: "./nu-phu" },
    { name: "Thế thân", path: "./the-than" },
    { name: "Dân quốc", path: "./dan-quoc" },
    { name: "OE", path: "./oe" },
    { name: "Đô thị", path: "./do-thi" },
    { name: "HE", path: "./he" },
    { name: "SE", path: "./se" },
    { name: "Nữ cường", path: "./nu-cuong" },
    { name: "Bách hợp", path: "./bach-hop" },
    { name: "Trọng sinh", path: "./trong-sinh" },
    { name: "Ngược", path: "./nguoc" },
    { name: "Cung đấu", path: "./cung-dau" },
    { name: "Hài hước", path: "./hai-huoc" },
    { name: "TXVT", path: "./txvt" },
    { name: "Vả mặt", path: "./va-mat" },
    { name: "Chữa lành", path: "./chua-lanh" },
    { name: "Mạt thế", path: "./mat-the" },
    { name: "Huyền huyễn", path: "./huyen-huyen" },
    { name: "Truyện teen", path: "./truyen-teen" },
    { name: "Cổ đại", path: "./co-dai" },
    { name: "Hiện đại", path: "./hien-dai" },
    { name: "Báo thù", path: "./bao-thu" },
  ];

  useEffect(() => {
    // Gọi API để lấy dữ liệu sách
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/stories"); // Thay "API_URL_HERE" bằng URL thật
        setBooks(response.data); // Lưu trữ dữ liệu vào state
        setLoading(false); // Đổi trạng thái loading khi nhận được dữ liệu
      } catch (error) {
        console.error("Có lỗi khi tải dữ liệu sách:", error);
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
          left: "-20px", // Đẩy nút sang trái ngoài slider
          transform: "translateY(-50%)",
          backgroundColor: "rgba(107, 105, 105, 0.5)", // Màu nền mặc định
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
          transition: "background-color 0.3s ease", // Thêm hiệu ứng hover
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = "#E53E5D") // Đổi màu khi hover
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = "rgba(107, 105, 105, 0.5)") // Trở về màu mặc định
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
          right: "-20px", // Đẩy nút sang phải ngoài slider
          transform: "translateY(-50%)",
          backgroundColor: "rgba(107, 105, 105, 0.5)", // Màu nền mặc định
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
          transition: "background-color 0.3s ease", // Thêm hiệu ứng hover
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = "#E53E5D") // Đổi màu khi hover
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = "rgba(107, 105, 105, 0.5)") // Trở về màu mặc định
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
    arrows: true, // Bật nút điều hướng
    prevArrow: <CustomPrevArrow />, // Sử dụng nút điều hướng tùy chỉnh
    nextArrow: <CustomNextArrow />, // Sử dụng nút điều hướng tùy chỉnh
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

  return (
    <div>
      {loading ? (
        <p>Đang tải...</p> // Hiển thị khi đang tải dữ liệu
      ) : (
        <>
          <div className="tag-container">
            {tags.map((tag, index) => (
              <Link key={index} to={tag.path} className="tag-item">
                {tag.name}
              </Link>
            ))}
          </div>
          <div className="featured-wrapper">
            <button className="bun tagbooks">
              <h2 className="section-title">GỢI Ý CHO BẠN</h2>
            </button>
            <div className="featured-section">
              <Slider {...settings}>
                {books.map((book, index) => (
                  <div className="book-card" key={index}>
                    <img src={book.image} alt={book.title} className="book-image" />
                    <Link to={`/gioi-thieu/${book.id}`} className="book-link">
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
          {/* Các phần tiếp theo... */}
        </>
      )}
    </div>
  );
}

export default Genre;
