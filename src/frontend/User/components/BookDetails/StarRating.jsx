import React, { useState } from "react";

const StarRating = ({ maxStars }) => {
  const [averageRating, setAverageRating] = useState(5); // Điểm trung bình
  const [totalReviews, setTotalReviews] = useState(5); // Tổng số lượt đánh giá
  const [userRating, setUserRating] = useState(null); // Đánh giá của người dùng

  // Xử lý khi người dùng chọn số sao
  const handleStarClick = (starIndex) => {
    const newRating = starIndex + 1;

    if (userRating === null) {
      // Nếu chưa đánh giá, thêm mới
      setTotalReviews(totalReviews + 1);
      setAverageRating((averageRating * totalReviews + newRating) / (totalReviews + 1));
    } else {
      // Nếu đã đánh giá, cập nhật lại
      setAverageRating(
        (averageRating * totalReviews - userRating + newRating) / totalReviews
      );
    }
    setUserRating(newRating); // Lưu đánh giá của người dùng
  };

  // Xử lý khi người dùng bỏ đánh giá
  const handleRemoveRating = () => {
    if (userRating !== null) {
      setAverageRating((averageRating * totalReviews - userRating) / (totalReviews - 1));
      setTotalReviews(totalReviews - 1);
      setUserRating(null); // Xóa đánh giá của người dùng
    }
  };

  return (
    <div>
      {/* Hiển thị các sao */}
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        {Array.from({ length: maxStars }).map((_, index) => (
          <i
            key={index}
            className={`star icon ${index < userRating ? "active" : ""}`}
            style={{
              fontSize: "24px",
              color: index < userRating ? "gold" : "gray",
              cursor: "pointer",
            }}
            onClick={() => handleStarClick(index)}
          ></i>
        ))}
      </div>

      {/* Hiển thị thông tin đánh giá */}
      <p>
        <strong>Đánh giá:</strong> {averageRating.toFixed(1)}/{maxStars} từ{" "}
        {totalReviews} lượt đánh giá
      </p>

      {/* Nút bỏ đánh giá */}
      {userRating !== null && (
        <button
          style={{
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
          onClick={handleRemoveRating}
        >
          Bỏ đánh giá
        </button>
      )}
    </div>
  );
};

export default StarRating;
