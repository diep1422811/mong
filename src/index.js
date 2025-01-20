import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // Đảm bảo file CSS được import đúng
import App from './App';

// Tạo root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render ứng dụng
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
