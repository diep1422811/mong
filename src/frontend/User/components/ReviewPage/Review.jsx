import React, { useState } from "react";
import reviewsData from "./data";
import "./Review.css";
import { GoPaperAirplane } from "react-icons/go";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";

const Review = () => {
  const [reviews, setReviews] = useState(reviewsData);
  const [newComment, setNewComment] = useState("");
  const [newReview, setNewReview] = useState("");
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [showAllComments, setShowAllComments] = useState({});
  const [editText, setEditText] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  const handleLike = (reviewId) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? { ...review, likes: review.liked ? review.likes - 1 : review.likes + 1, liked: !review.liked }
          : review
      )
    );
  };

  const handleCommentLike = (reviewId, commentId) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            comments: review.comments.map((comment) =>
              comment.id === commentId
                ? { ...comment, likes: comment.liked ? comment.likes - 1 : comment.likes + 1, liked: !comment.liked }
                : comment
            ),
          };
        }
        return review;
      })
    );
  };

  const handleComment = (reviewId) => {
    if (newComment.trim()) {
      const updatedReviews = reviews.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            comments: [
              ...review.comments,
              { id: Date.now(), username: "User", content: newComment, likes: 0, liked: false },
            ],
          };
        }
        return review;
      });
      setReviews(updatedReviews);
      setNewComment("");
    }
  };

  const handleNewReview = () => {
    if (newReview.trim()) {
      const newReviewData = {
        id: Date.now(),
        username: "User",
        content: newReview,
        likes: 0,
        liked: false,
        comments: [],
      };
      setReviews([newReviewData, ...reviews]);
      setNewReview("");
    }
  };

  const handleKeyDownReview = (e) => {
    if (e.key === "Enter") {
      handleNewReview();
    }
  };

  const handleKeyDown = (e, reviewId) => {
    if (e.key === "Enter") {
      handleComment(reviewId);
    }
  };

  const toggleCommentBox = (reviewId) => {
    setActiveReviewId(activeReviewId === reviewId ? null : reviewId);
  };

  const toggleShowAllComments = (reviewId) => {
    setShowAllComments({
      ...showAllComments,
      [reviewId]: !showAllComments[reviewId],
    });
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter((review) => review.id !== reviewId));
  };

  const handleDeleteComment = (reviewId, commentId) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        return {
          ...review,
          comments: review.comments.filter((comment) => comment.id !== commentId),
        };
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  const handleEditReview = (reviewId, currentContent) => {
    setEditingReviewId(reviewId);
    setEditText(currentContent);
  };

  const handleEditComment = (reviewId, commentId, currentContent) => {
    setEditingComment({ reviewId, commentId });
    setEditText(currentContent);
  };

  const saveEdit = () => {
    if (editingReviewId !== null) {
      setReviews(
        reviews.map((review) =>
          review.id === editingReviewId ? { ...review, content: editText } : review
        )
      );
      setEditingReviewId(null);
    } else if (editingComment.reviewId !== null && editingComment.commentId !== null) {
      setReviews(
        reviews.map((review) =>
          review.id === editingComment.reviewId
            ? {
                ...review,
                comments: review.comments.map((comment) =>
                  comment.id === editingComment.commentId
                    ? { ...comment, content: editText }
                    : comment
                ),
              }
            : review
        )
      );
      setEditingComment(null);
    }
    setEditText("");
  };

  const handleKeyDownEdit = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    }
  };

  return (
    <div>
      <div className="top-review-container">TOP REVIEW</div>
      <div className="new-review-container">
        <div className="input-with-icon">
          <input
            type="text"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            onKeyDown={handleKeyDownReview}
            placeholder="Hãy để lại cảm nhận của bạn..."
            className="new-review-input"
          />
          <GoPaperAirplane className="send-icon" onClick={handleNewReview} />
        </div>
      </div>

      {reviews.map((review) => (
        <div key={review.id} className="review-container">
          <h3 className="review-username">{review.username}</h3>
          {editingReviewId === review.id ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDownEdit} // Thêm sự kiện onKeyDown cho phần chỉnh sửa review
                className="edit-input"
              />
              <button onClick={saveEdit}>Lưu</button>
            </div>
          ) : (
            <p className="review-content">{review.content}</p>
          )}

          <div className="review-buttons-container">
            {review.username === "User" && (
              <>
                <BiEditAlt
                  className="action-icon"
                  onClick={() => handleEditReview(review.id, review.content)}
                />
                <BiTrash
                  className="action-icon"
                  onClick={() => handleDeleteReview(review.id)}
                />
              </>
            )}

            <button className="review-like-button" onClick={() => handleLike(review.id)}>
              {review.liked ? <FaHeart /> : <CiHeart />} ({review.likes})
            </button>

            <button
              className="review-comment-button"
              onClick={() => toggleCommentBox(review.id)}
            >
              <FaRegCommentDots /> Bình luận
            </button>
          </div>

          <div className="comments-container">
            {(showAllComments[review.id]
              ? review.comments
              : review.comments.slice(0, 2)
            ).map((comment) => (
              <div key={comment.id} className="comment">
                <div>
                  <strong className="comment-username">{comment.username}</strong>:{" "}
                  {editingComment?.reviewId === review.id && editingComment?.commentId === comment.id ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleKeyDownEdit} // Thêm sự kiện onKeyDown cho phần chỉnh sửa comment
                        className="edit-input"
                      />
                      <button onClick={saveEdit}>Lưu</button>
                    </div>
                  ) : (
                    comment.content
                  )}
                </div>

                {comment.username === "User" && (
                  <div className="comment-actions">
                    <BiEditAlt
                      className="action-icon"
                      onClick={() => handleEditComment(review.id, comment.id, comment.content)}
                    />
                    <BiTrash
                      className="action-icon"
                      onClick={() => handleDeleteComment(review.id, comment.id)}
                    />
                  </div>
                )}

                <button
                  className="comment-like-button"
                  onClick={() => handleCommentLike(review.id, comment.id)}
                >
                  {comment.liked ? <FaHeart /> : <CiHeart />} ({comment.likes || 0})
                </button>
              </div>
            ))}

            {review.comments.length > 2 && (
              <button
                className="show-more-comments"
                onClick={() => toggleShowAllComments(review.id)}
              >
                {showAllComments[review.id] ? "Ẩn bớt..." : "Xem tiếp..."}
              </button>
            )}

            {activeReviewId === review.id && (
              <div className="comment-input-container">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, review.id)}
                  placeholder={`Trả lời ${review.username}`}
                  className="comment-input"
                />
                <GoPaperAirplane className="send-comment-icon" onClick={() => handleComment(review.id)} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Review;
