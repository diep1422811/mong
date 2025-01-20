import React, { useState, useEffect } from "react";
import banner1 from '../image/banner/banner1.png';
import banner2 from '../image/banner/banner2.png';
import banner3 from '../image/banner/banner3.png';
import banner4 from '../image/banner/banner4.png';
import "./BannerSlider.css";

function BannerSlider() {
  // Danh sách ảnh banner
  const banners = [banner1, banner2, banner3, banner4];

  // State để lưu vị trí slide hiện tại
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hàm chuyển sang slide tiếp theo
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  // Hàm chuyển về slide trước
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  // Tự động chuyển slide sau 3 giây
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
  }, []);

  return (
    <div className="banner-slider">
      {/* Hiển thị ảnh banner hiện tại */}
      <img
        src={banners[currentIndex]}
        alt={`Banner ${currentIndex + 1}`}
        className="banner-image"
      />

      {/* Nút điều hướng */}
      <button className="banner-button prev-btn" onClick={prevSlide}>{"<"}</button>
      <button className="banner-button next-btn" onClick={nextSlide}>{">"}</button>
    </div>
  );
}

export default BannerSlider;
