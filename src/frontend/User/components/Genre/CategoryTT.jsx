import React, { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";

function CategoryTTPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories(); // Gọi API lấy tất cả categories
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Thể loại tổng quát</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryTTPage;
