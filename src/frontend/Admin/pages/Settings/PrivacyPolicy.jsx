import React, { useState } from "react";

const PrivacyPolicy = () => {
  const [content, setContent] = useState(
    "This is the privacy policy page. Add your company's privacy policy here.".repeat(10)
  );
  const [newContent, setNewContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      setNewContent(content); // Reset nội dung nếu hủy chỉnh sửa
    }
    setIsEditing(!isEditing);
  };

  const handleContentChange = (e) => {
    setNewContent(e.target.value);
  };

  const handleSave = () => {
    setContent(newContent);
    setIsEditing(false);
    alert("Privacy Policy updated successfully!");
  };

  const handleCancel = () => {
    setNewContent(content); // Quay lại nội dung cũ
    setIsEditing(false);
  };

  return (
    <div>
      <h1>Privacy Policy</h1>
      <div>
        {isEditing ? (
          <textarea
            value={newContent}
            onChange={handleContentChange}
            rows="10"
            style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
            }}
          />
        ) : (
          <p 
            style={{
                padding: "10px",
                fontSize: "14px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                maxWidth : "400px",
                maxHeight: "150px", 
                overflow: "auto",
            }}>
            {content}</p>
        )}
        <div>
          {isEditing ? (
            <>
              <button onClick={handleSave} 
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
              <button onClick={handleCancel} 
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
            <button onClick={handleEditToggle} 
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
  );
};

export default PrivacyPolicy;
