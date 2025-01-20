import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

const OTP = () => {
    const { state } = useLocation();  // Lấy email từ state (được chuyển từ trang đăng ký)
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://3.26.145.187:8000/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: state.email, otp }),
            });

            if (response.ok) {
                console.log('OTP verified successfully, registration completed');
                // Chuyển người dùng đến trang đăng nhập sau khi OTP xác nhận thành công
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Invalid OTP.');
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleOtpSubmit}>
                <h1>Enter OTP</h1>
                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        required 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                    />
                </div>
                {error && <div className="error-message">{error}</div>}  {/* Hiển thị lỗi nếu có */}
                <button type="submit">Verify OTP</button>
            </form>
        </div>
    );
};

export default OTP;
