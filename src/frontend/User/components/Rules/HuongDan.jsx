import React from "react";
import './HuongDan.css';

const HuongDan = () => {
  return (
    <div className="huongdan-container">
        <p className="welcome-message">
        Bạn gặp khó khăn khi lần đầu trải nghiệm tại Mộng? Đừng lo lắng có chúng mình đây!
      </p>
      <h1>Hướng Dẫn Sử Dụng Trang Web Truyện</h1>

      <h2>1. Đăng ký và Đăng nhập</h2>

      <h3>1.1. Đăng ký tài khoản</h3>
      <ol>
        <li>
          <strong>Bước 1:</strong> Truy cập trang web truyện, sau đó nhấp vào nút <strong>"Sign Up"</strong> nằm ở góc phải trên cùng của giao diện.
        </li>
        <li>
          <strong>Bước 2:</strong> Nhập các thông tin cần thiết vào biểu mẫu đăng ký:
          <ul>
            <li><strong>Họ và tên:</strong> Điền đầy đủ tên của bạn.</li>
            <li><strong>Email:</strong> Cung cấp địa chỉ email hợp lệ để nhận thông tin xác nhận tài khoản.</li>
            <li><strong>Mật khẩu:</strong> Tạo một mật khẩu an toàn (gồm chữ hoa, chữ thường, số và ký tự đặc biệt).</li>
            <li><strong>Xác nhận mật khẩu:</strong> Nhập lại mật khẩu để xác nhận.</li>
          </ul>
        </li>
        <li>
          <strong>Bước 3:</strong> Nhấn nút <strong>"Sign Up"</strong> để hoàn tất. Hệ thống sẽ gửi email xác nhận.
        </li>
        <li>
          <strong>Bước 4:</strong> Kiểm tra email, nhấp vào liên kết xác nhận để kích hoạt tài khoản.
        </li>
      </ol>

      <h3>1.2. Đăng nhập tài khoản</h3>
      <ol>
        <li><strong>Bước 1:</strong> Nhấp vào nút <strong>"Sign In"</strong> ở góc phải trên cùng.</li>
        <li><strong>Bước 2:</strong> Nhập email và mật khẩu đã đăng ký.</li>
        <li><strong>Bước 3:</strong> Nhấn nút <strong>"Sign In"</strong>.</li>
      </ol>

      <h3>1.3. Quên mật khẩu</h3>
      <p>Nếu quên mật khẩu, nhấp vào liên kết <strong>"Recover your password"</strong> tại giao diện đăng nhập. Sau đó nhập email và làm theo hướng dẫn để đặt lại mật khẩu.</p>

      <h2>2. Chọn truyện theo danh mục, thể loại, trạng thái</h2>

      <h3>2.1. Tìm truyện theo danh mục</h3>
      <ol>
        <li><strong>Bước 1:</strong> Truy cập vào menu <strong>"Category"</strong> hoặc <strong>"Genre"</strong>.</li>
        <li>
          <strong>Bước 2:</strong> Các mục phổ biến:
          <ul>
            <li><strong>Truyện mới:</strong> Những truyện vừa cập nhật hoặc mới phát hành.</li>
            <li><strong>Truyện nổi bật:</strong> Các truyện được nhiều người đọc và đánh giá cao.</li>
            <li><strong>Truyện hoàn thành:</strong> Danh sách truyện đã kết thúc.</li>
          </ul>
        </li>
      </ol>

      <h3>2.2. Tìm truyện theo thể loại</h3>
      <ol>
        <li><strong>Bước 1:</strong> Trong menu <strong>"Genre"</strong>, chọn thể loại mà bạn yêu thích (như Ngôn tình, Lãng mạn,...).</li>
        <li><strong>Bước 2:</strong> Nhấn vào thể loại để hiển thị danh sách truyện.</li>
      </ol>



      <h2>3. Một số lưu ý khi chọn truyện</h2>
      <ul>
        <li>Sử dụng thanh <strong>tìm kiếm</strong> nếu bạn đã biết tên truyện hoặc tác giả.</li>
        <li>Đọc phần <strong>giới thiệu truyện</strong> và <strong>nhận xét của người đọc</strong> trước khi quyết định theo dõi.</li>
      </ul>

      <p className="closing-message">
        Hãy cùng Mộng viết nên những trang sách - dệt ước mơ của bạn!
      </p>
      <p className="welcome-message">
        Chúc bạn có trải nghiệm tuyệt vời khi sử dụng trang web của chúng tôi!
      </p>
    </div>
  );
};

export default HuongDan;
