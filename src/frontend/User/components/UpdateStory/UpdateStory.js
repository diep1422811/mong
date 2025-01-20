import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import "./UpdateStory.css";
const API_URL = 'http://3.26.145.187:8000/api/stories';
const HEADERS = {
  'Content-Type': 'application/json',
};

function UpdateStory() {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const [storyData, setStoryData] = useState({
    title: '',
    description: '',
    author_name: '',
    status: 'ONGOING',
    category_ids: [],
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchStory = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập');
      navigate('/login');
      return;
    }

    if (!storyId) {
      toast.error('Không tìm thấy truyện');
      navigate('/myStories');
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/${storyId}`,
        {
          headers: {
            ...HEADERS,
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setStoryData({
          title: response.data.title || '',
          description: response.data.description || '',
          author_name: response.data.author_name || '',
          status: response.data.status || 'ONGOING',
          category_ids: response.data.category_ids || [],
        });
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      toast.error('Không thể tải thông tin truyện');
      navigate('/myStories');
    } finally {
      setLoading(false);
    }
  }, [storyId, navigate]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/${storyId}`,
        {
          title: storyData.title.trim(),
          description: storyData.description.trim(),
          author_name: storyData.author_name.trim(),
          status: storyData.status,
          category_ids: storyData.category_ids,
        },
        {
          headers: {
            ...HEADERS,
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Cập nhật truyện thành công!');
        navigate('/myStories');
      }
    } catch (error) {
      console.error('Error updating story:', error);
      if (error.response?.status === 422) {
        toast.error('Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật truyện');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="edit-story-container">
      <h2>Chỉnh sửa truyện</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tiêu đề:</label>
          <input
            type="text"
            name="title"
            value={storyData.title}
            onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Giới thiệu:</label>
          <textarea
            name="description"
            value={storyData.description}
            onChange={(e) => setStoryData({ ...storyData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Tác giả:</label>
          <input
            type="text"
            name="author_name"
            value={storyData.author_name}
            onChange={(e) => setStoryData({ ...storyData, author_name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Trạng thái:</label>
          <select
            name="status"
            value={storyData.status}
            onChange={(e) => setStoryData({ ...storyData, status: e.target.value })}
          >
            <option value="ONGOING">Đang viết</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
          <button type="button" onClick={() => navigate('/myStories')}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateStory;
