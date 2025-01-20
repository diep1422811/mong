import React, { useState } from "react";

function EditChapter() {
  const [chapterTitle, setChapterTitle] = useState("Chương 1");
  const [name, setName] = useState("A");
  const [content, setContent] = useState(
    "Đảo mộng mơ là một lát cắt đời sống của những đứa trẻ lớn lên..."
  );

  const handleSave = () => {
    console.log("Đã lưu:", { chapterTitle, name, content });
    alert("Chương đã được lưu!");
  };

  const handleCancel = () => {
    alert("Hủy chỉnh sửa!");
  };

  return (
    <div className="edit-chapter-container">
      <h1>CHỈNH SỬA / ĐẢO MỘNG MƠ / {chapterTitle}</h1>

      <div className="form-group">
        <label>Chương</label>
        <input
          type="text"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Tên chương</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Nội dung</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        ></textarea>
      </div>

      <div className="button-group">
        <button className="cancel-btn" onClick={handleCancel}>
          Hủy
        </button>
        <button className="save-btn" onClick={handleSave}>
          Lưu
        </button>
      </div>
    </div>
  );
}

export default EditChapter;
