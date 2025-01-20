import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu và xác nhận mật khẩu có trùng khớp không
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Kiểm tra định dạng email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email.");
            return;
        }

        setError(''); // Xóa lỗi nếu mọi thứ hợp lệ

        try {
            // Gửi yêu cầu đăng ký đến backend
            const response = await fetch('http://3.26.145.187:8000/api/auth/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                console.log('Registration successful, please check your email for OTP');
                // Sau khi đăng ký thành công, chuyển sang trang OTP
                navigate('/otp', { state: { email } });
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Please try again.');
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Create an Account</h1>
                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        required 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        required 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </div>
                {error && <div className="error-message">{error}</div>}  {/* Hiển thị lỗi nếu có */}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
