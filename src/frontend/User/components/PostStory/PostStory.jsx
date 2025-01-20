import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
//import 'react-toastify/dist/ReactToastify.css';
import "./PostStory.css"
function PostStory() {
  // Dữ liệu thể loại
  const categoryData = {
    "Văn học nước ngoài": [
      { id: 16, name: "Thơ" },
      { id: 17, name: "Kịch" },
      { id: 18, name: "Kỳ ảo" },
      { id: 19, name: "Thần thoại" },
      { id: 20, name: "Dân gian" },
      { id: 21, name: "Hiện thực" },
    ],
    "Văn học Việt Nam": [
      { id: 4, name: "Truyện ngắn" },
      { id: 8, name: "Lãng mạn" },
      { id: 6, name: "Kinh dị" },
      { id: 15, name: "Giả tưởng" },
      { id: 10, name: "Hồi ký" },
      { id: 12, name: "Phiêu lưu" },
    ],
    "Tiểu thuyết": [
      { id: 22, name: "Ngôn tình" },
      { id: 23, name: "Đam mỹ" },
      { id: 24, name: "Xuyên không" },
      { id: 25, name: "Hệ thống" },
      { id: 26, name: "Điền văn" },
      { id: 27, name: "Ngọt sủng" },
      { id: 28, name: "Linh dị" },
      { id: 29, name: "Nữ phụ" },
      { id: 30, name: "Thế thân" },
      { id: 31, name: "Dân quốc" },
      { id: 32, name: "OE" },
      { id: 33, name: "Đô thị" },
      { id: 34, name: "HE" },
      { id: 35, name: "SE" },
      { id: 36, name: "Nữ cường" },
      { id: 37, name: "Bách hợp" },
      { id: 38, name: "Trọng sinh" },
      { id: 39, name: "Ngược" },
      { id: 40, name: "Cung đấu" },
      { id: 41, name: "Hài hước" },
      { id: 42, name: "TXVT" },
      { id: 43, name: "Vả mặt" },
      { id: 44, name: "Chữa lành" },
      { id: 45, name: "Mạt thế" },
      { id: 46, name: "Huyền huyễn" },
      { id: 47, name: "Truyện teen" },
      { id: 48, name: "Cổ đại" },
      { id: 49, name: "Hiện đại" },
      { id: 51, name: "Báo thù" },
    ],
  };

  // State quản lý dữ liệu form
  const [storyData, setStoryData] = useState({
    title: '',
    description: '',
    author_name: '',
    status: 'ONGOING',
    category_ids: [],
    selectedCategory: '', // Thể loại chính
  });

  const navigate = useNavigate();

  // Hàm xử lý khi chọn thể loại chính
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setStoryData({
      ...storyData,
      selectedCategory,
      category_ids: [], // Reset danh sách category_ids khi thay đổi thể loại chính
    });
  };

  // Hàm xử lý gửi dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu các trường bắt buộc không có giá trị
    if (!storyData.title || !storyData.description || !storyData.author_name || storyData.category_ids.length === 0) {
      toast.error('Please fill in all fields!');
      return;
    }

    // In dữ liệu trước khi gửi
    console.log('Data being sent:', storyData);

    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      if (!token) {
        toast.error('Please login first.');
        return;
      }

      // Gửi yêu cầu POST đến API
      const response = await axios.post('http://3.26.145.187:8000/api/stories', storyData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Thông báo thành công và chuyển hướng
      toast.success('Story created successfully!');
      navigate('/myStories');
    } catch (error) {
      // In lỗi ra console và thông báo lỗi
      console.error('Error creating story:', error.response ? error.response.data : error.message);

      if (error.response && error.response.status === 422) {
        toast.error('Invalid data! Please check your inputs.');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  // Render các checkbox thể loại phụ
  const renderCategoryCheckboxes = () => {
    const categories = categoryData[storyData.selectedCategory];
    if (!categories) return null;

    const rows = [];
    let row = [];
    categories.forEach((category, index) => {
      row.push(
        <div key={category.id} style={{ marginRight: '20px' }}>
          <input
            type="checkbox"
            id={`category-${category.id}`}
            value={category.id}
            checked={storyData.category_ids.includes(category.id)}
            onChange={(e) => {
              const selectedCategoryIds = e.target.checked
                ? [...storyData.category_ids, category.id]
                : storyData.category_ids.filter(id => id !== category.id);
              setStoryData({ ...storyData, category_ids: selectedCategoryIds });
            }}
          />
          <label htmlFor={`category-${category.id}`}>{category.name}</label>
        </div>
      );

      if (row.length === 3 || index === categories.length - 1) {
        rows.push(
          <div key={`row-${index}`} style={{ display: 'flex', marginBottom: '10px', justifyContent: 'flex-start' }}>
            {row}
          </div>
        );
        row = []; // Reset hàng
      }
    });
    return rows;
  };

  return (
    <div>
      <h2>Create New Story</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={storyData.title}
            onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={storyData.description}
            onChange={(e) => setStoryData({ ...storyData, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Author Name:</label>
          <input
            type="text"
            name="author_name"
            value={storyData.author_name}
            onChange={(e) => setStoryData({ ...storyData, author_name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={storyData.status}
            onChange={(e) => setStoryData({ ...storyData, status: e.target.value })}
          >
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div>
          <label>Main Category:</label>
          <select
            name="selectedCategory"
            value={storyData.selectedCategory}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select a category</option>
            {Object.keys(categoryData).map((categoryGroup) => (
              <option key={categoryGroup} value={categoryGroup}>
                {categoryGroup}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Sub Categories:</label>
          <div>{renderCategoryCheckboxes()}</div>
        </div>
        <button type="submit">Create Story</button>
      </form>
    </div>
  );
}

export default PostStory;
