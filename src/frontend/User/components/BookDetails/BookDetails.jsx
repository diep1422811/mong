import React, { useState } from "react";
import "./BookDetails.css";

import bookCover from "../../image/book/book1.jpg";
import StarRating from "./StarRating";

function BookDetails() {
  const [isReviewActive, setReviewActive] = useState(false);
  const [liked, setLiked] = useState(false); // Quản lý trạng thái trái tim
  const [isWarningActive, setWarningActive] = useState(false); // Quản lý trạng thái cảnh báo
  const [isModalOpen, setModalOpen] = useState(false); // Quản lý trạng thái modal

  // Hàm để xử lý khi nhấp vào review
  const handleReviewClick = () => {
    setReviewActive(!isReviewActive);
  };

  // Hàm để xử lý khi nhấp vào trái tim
  const toggleHeart = () => {
    setLiked(!liked); // Đảo trạng thái yêu thích
  };

  // Hàm để xử lý khi nhấp vào biểu tượng cảnh báo
  const toggleWarning = () => {
    setWarningActive(!isWarningActive); // Đảo trạng thái cảnh báo
    setModalOpen(true); // Mở modal khi nhấp vào "Báo cáo"
  };

  // Hàm để đóng modal
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="book-details">
      <img src={bookCover} alt="Book Cover" className="book-cover" />

      <div className="details">
        <h1><strong>Đảo mộng mơ</strong></h1>
        <p><strong>Tác giả:</strong> Nguyễn Nhật Ánh</p>
        <p><strong>Danh mục:</strong> Văn học Việt Nam</p>
        <p><strong>Thể loại:</strong> Hồi ký, phiêu lưu</p>
        <p><strong>Tổng số chương:</strong> 10 chương</p>
        <p><strong>Tình trạng:</strong> Full</p>

        {/* Phần đánh giá sao */}
        <div className="rating-container">
          <StarRating maxStars={5} initialRating={5} />
        </div>

        {/* Phần chứa các biểu tượng ở dưới */}
        <div className="icon-container">
          {/* Biểu tượng cảnh báo và văn bản "Báo cáo" */}
         {/* Biểu tượng Yêu thích */}
         <div className={`like-tt ${liked ? "liked" : ""}`} onClick={toggleHeart}>
            <i className="heart icon"></i>
            <span>{liked ? "Đã yêu thích" : "Yêu thích"}</span>
          </div>

          {/* Biểu tượng Review */}
          <div className={`review-tt ${isReviewActive ? "active" : ""}`} onClick={handleReviewClick}>
            <i className="edit icon"></i>
            <span className="review-text">Review</span>
          </div>

          
          <div 
            className={`warning-icon ${isWarningActive ? "active" : ""}`} 
            onClick={toggleWarning}
          >
            <i className="exclamation circle icon"></i>
            <span className="warning-text">Báo cáo</span>
          </div>
        </div>
      </div>

      {/* Modal cho báo cáo */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Vui lòng cho biết vấn đề bạn muốn báo cáo!</h2>
            <textarea placeholder="Viết báo cáo tại đây..."rows="5" cols="50"></textarea>
            <button onClick={closeModal}>Gửi Báo Cáo</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default BookDetails;
