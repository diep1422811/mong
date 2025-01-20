import axios from "axios";

const API_BASE_URL = "http://localhost:8000/categories"; // Đổi URL nếu cần

// Hàm lấy tất cả categories từ backend
export const getCategories = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách categories:", error);
    return [];
  }
};

// Hàm lọc category theo type (ví dụ: "VN", "NN")
export const getCategoriesByType = async (type) => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.filter(category => category.type === type);
  } catch (error) {
    console.error("Lỗi khi lấy categories theo type:", error);
    return [];
  }
};
