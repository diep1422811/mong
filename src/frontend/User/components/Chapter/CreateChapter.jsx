import React, { useState } from "react";
import "./CreateChapter.css";

function CreateChapter({ currentChapters = [] }) {
    const [chapterNumber, setChapterNumber] = useState(currentChapters.length + 1);
    const [chapterName, setChapterName] = useState("");
    const [content, setContent] = useState("");
  
    const handleSave = () => {
      console.log({
        chapterNumber,
        chapterName,
        content,
      });
      alert(`Chương ${chapterNumber} đã được lưu!`);
      setChapterNumber((prev) => prev + 1); // Tăng số chương tự động
      setChapterName("");
      setContent("");
    };
  
    const handleCancel = () => {
      setChapterName("");
      setContent("");
    };
  
    return (
      <div className="create-chapter-container">
        <h1 className="title">CHƯƠNG MỚI</h1>
  
        <div className="form-group">
          <label>CHƯƠNG</label>
          <input
            type="text"
            value={`CHƯƠNG ${chapterNumber}`}
            disabled
            readOnly
          />
        </div>
  
        <div className="form-group">
          <label>Tên chương</label>
          <input
            type="text"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            placeholder="Nhập tên chương"
          />
        </div>
  
        <div className="form-group">
          <label>NỘI DUNG</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung chương"
          ></textarea>
        </div>
  
        <div className="button-group">
          <button className="cancel-button" onClick={handleCancel}>
            HỦY
          </button>
          <button className="save-button" onClick={handleSave}>
            LƯU
          </button>
        </div>
      </div>
    );
  }
  

export default CreateChapter;
