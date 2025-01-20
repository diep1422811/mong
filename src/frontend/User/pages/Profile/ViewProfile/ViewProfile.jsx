import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaRegFolderOpen, FaUserAstronaut, FaSyncAlt } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import "./ViewProfile.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import book_cover from "../../../image/logo/mongLogo.png"
const ViewProfile = () => {
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
    slidesToShow: 5, // Reduced from 7 to 5 for better visibility
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };
  const [userProfile, setUserProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUserData = async () => {
        try {
          // Fetch both profile and favorites data
          const [profileResponse, favoritesResponse] = await Promise.all([
            fetch(`http://3.26.145.187:8000/api/users/me`, {
              headers: { "Authorization": `Bearer ${token}` },
            }),
            // Also fetch the stories to get full story details
            fetch(`http://3.26.145.187:8000/api/stories`, {
              headers: { "Authorization": `Bearer ${token}` },
            })
          ]);

          const profileData = await profileResponse.json();
          const storiesData = await favoritesResponse.json();

          // Map favorite IDs to full story details
          const favoriteStories = profileData.favorites
            .map(favorite => {
              const story = storiesData.items.find(s => s.story_id === favorite.story_id);
              return story ? {
                ...story,
                favorite_id: favorite.favorite_id,
                favorited_at: favorite.created_at
              } : null;
            })
            .filter(Boolean); // Remove null entries

          setUserProfile({
            ...profileData,
            favorites: favoriteStories
          });

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("idUser");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("idUser"); // Remove user data on logout
      navigate("/login"); 
  }
  const handleRedirect = () => {
    if (userProfile.role === "ADMIN" || userProfile.role === "SUPERADMIN") {
      navigate("/admin/dashboard");
    } else {
      alert("Permission Denied: You do not have access to this page.");
    }
  };

  const renderFavorites = () => {
    if (!userProfile?.favorites?.length) {
      return <p className="no-books">Không có truyện nào trong danh sách yêu thích.</p>;
    }

    return (
      <Slider {...settings}>
        {userProfile.favorites.map((story, index) => (
          <div key={story.story_id || index} className="book-card">
            <img 
              src={book_cover}
              alt={story.title} 
              className="book-image"
              onClick={() => navigate(`/stories/${story.story_id}`)}
            />
            <h3 className="book-title">{story.title}</h3>
            <div className="tags">
              <span className={`tag ${story.status?.toLowerCase() || ''}`}>
                {story.status === "ONGOING" ? "Đang viết" : 
                 story.status === "COMPLETED" ? "Hoàn thành" : 
                 "Unknown"}
              </span>
            </div>
            <div className="rating">⭐ {story.rating_avg?.toFixed(1) || '0.0'}</div>
          </div>
        ))}
      </Slider>
    );
  };

  const renderStories = () => {
    if (!userProfile?.stories?.length) {
      return <p className="no-books">Bạn chưa đăng truyện nào.</p>;
    }

    return (
      <Slider {...settings}>
        {userProfile.stories.map((story, index) => (
          <div key={story.story_id || index} className="book-card">
            <img 
              src={book_cover}
              alt={story.title} 
              className="book-image"
              onClick={() => navigate(`/stories/${story.story_id}`)}
            />
            <h3 className="book-title">{story.title}</h3>
            <div className="tags">
              <span className={`tag ${story.status?.toLowerCase() || ''}`}>
                {story.status === "ONGOING" ? "Đang viết" : 
                 story.status === "COMPLETED" ? "Hoàn thành" : 
                 "Unknown"}
              </span>
            </div>
            <div className="rating">⭐ {story.rating_avg?.toFixed(1) || '0.0'}</div>
          </div>
        ))}
      </Slider>
    );
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-profile">
      <div className={`profile-container ${isDropdownOpen ? "dropdown-open" : ""}`}>
        <div className={`profile-left ${isDropdownOpen ? "expanded" : ""}`}>
          <button className="dropdown-toggle-btn" onClick={toggleDropdown}>☰</button>
          <div className={`dropdown-menuu ${isDropdownOpen ? "open" : ""}`}>
            <button className="dropdown-itemm" onClick={() => navigate("/myStories")}>
              <FaRegFolderOpen /> Quản lý truyện
            </button>
            <button className="dropdown-itemm" onClick={() => navigate("/viewProfile")}>
              <FaEdit /> Đăng truyện
            </button>
            <button className="dropdown-itemm" onClick={() => navigate("/reset")}>
              <BiReset /> Đổi mật khẩu
            </button>
            <button className="dropdown-itemm" onClick={handleLogOut}>
              <FaSyncAlt /> Đăng xuất
            </button>
            <button className="dropdown-itemm" onClick={handleRedirect}>
              <FaSyncAlt /> Chuyển trang
            </button>
          </div>
        </div>
        <div className="profile-center">
          <FaUserAstronaut className="profile-avatar" />
          <h2 className="profile-name">{userProfile.username}</h2>
        </div>

        <div className="profile-right">
          <h3>Thông tin người dùng</h3>
          <ul>
            <li>Email: {userProfile.email}</li>
            <li>Số truyện đã đăng: {userProfile.stories?.length || 0}</li>
            <li>Số truyện yêu thích: {userProfile.favorites?.length || 0}</li>
            <li>Số lần vi phạm: {userProfile.reports?.length || 0}</li>
          </ul>
        </div>
      </div>

      <div className="featured-wrapper">
        <div className="bun tagbooks">
          <h2 className="section-title">KHO YÊU THÍCH</h2>
        </div>
        <div className="featured-section">
          {renderFavorites()}
        </div>
      </div>

      <div className="featured-wrapper">
        <div className="bun tagbooks">
          <h2 className="section-title" onClick={() => navigate("/myStories")}>
            KHO CỦA BẠN
          </h2>
        </div>
        <div className="featured-section">
          {renderStories()}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;