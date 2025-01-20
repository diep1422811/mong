import React, { useState, useEffect } from "react";
import axios from "axios";

const WebsiteIntro = () => {
  const [introContent, setIntroContent] = useState("");
  const [content, setContent] = useState("");
  const [newContent, setNewContent] = useState(content);
  const [introImage, setIntroImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchIntroContent();
  }, []);

  const fetchIntroContent = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/get-website-intro");
      setIntroContent(response.data.content);
      setNewContent(response.data.content);
      setCurrentImage(response.data.imageUrl);
    } catch (error) {
      setMessage("Failed to load website intro. Please try again.");
    }
  };

  const handleContentChange = (e) => {
    setNewContent(e.target.value);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setNewContent(introContent);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setNewContent(introContent);
    setIsEditing(false);
  };
  const handleSave = () => {
    setContent(newContent); // Lưu văn bản vào state content
    setIsEditing(false); // Dừng chế độ chỉnh sửa
    alert("Privacy Policy updated successfully!"); // Hiển thị thông báo
  };  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIntroImage(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await axios.delete("http://localhost:8000/admin/delete-website-intro-image");
      setMessage(response.data.message || "Image deleted successfully.");
      setCurrentImage("");
    } catch (error) {
      setMessage("Failed to delete image.");
    }
  };

  const handleUpdateIntro = async () => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("content", newContent); // Thêm nội dung mới
    if (introImage) {
      formData.append("image", introImage); // Thêm ảnh mới (nếu có)
    }
  
    try {
      const response = await axios.post("http://localhost:8000/admin/update-website-intro", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message || "Website introduction updated successfully!");
      fetchIntroContent(); // Lấy lại nội dung mới sau khi cập nhật
    } catch (error) {
      setMessage("Failed to update introduction. Please check your input.");
    } finally {
      setIsUpdating(false);
    }
  };  

  return (
    <div className="website-intro">
      <h1>Website Introduction</h1>

      {/* Nội dung và nút chỉnh sửa */}
      <div>
        <div >
          {isEditing ? (
            <textarea
            value={newContent}
            onChange={handleContentChange}
            rows="5"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}          
            ></textarea>
          ) : (
            <p
              style={{
                padding: "10px",
                fontSize: "14px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                maxWidth : "700px",
                maxHeight: "200px", 
                overflow: "auto",
              }}
            >
              {introContent}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "2px" }}>
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  style={{
                    width: "50px",
                    fontSize: "12px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}>
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    width: "50px",
                    fontSize: "12px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                style={{
                  width: "50px",
                  marginTop:"-10px",
                  fontSize: "12px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quản lý ảnh */}
      <div>
        <h3>Current Photo</h3>
        {currentImage ? (
          <div style={{ marginBottom: "10px" }}>
            <img src={currentImage} alt="Intro" style={{ maxWidth: "100%", height: "auto" }} />
            <button
              onClick={handleDeleteImage}
              style={{
                display: "block",
                marginTop: "10px",
                padding: "8px 12px",
                fontSize: "12px",
                backgroundColor: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Delete Image
            </button>
          </div>
        ) : (
          <p>No current photo available.</p>
        )}

        <h3>Add New Photo</h3>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* Nút cập nhật toàn bộ Intro */}
      <button
        onClick={handleUpdateIntro}
        disabled={isUpdating || (!newContent && !introImage && !currentImage)}
      >
        {isUpdating ? "Updating..." : "Update"}
      </button>

      {/* Thông báo */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default WebsiteIntro;
