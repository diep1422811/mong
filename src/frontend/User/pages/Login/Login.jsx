import React, { useState, useEffect } from "react";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://3.26.145.187:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('username', data.user.username);

                navigate('/'); // Redirect to home page or user dashboard
            } else {
                alert('Invalid email or password! Please try again');
            }
        } catch (error) {
            console.error("Error calling API:", error);
            alert('An error occurred during login. Please try again later!');
        }
    };

    return (
        <body className="login-page">
  <div className="wrapperr">
    <form onSubmit={handleSubmit}>
      <h1>Welcome back,</h1>
      <h2>Please login to your account below</h2>
      <div className="input-boxx">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FaUser className="icon" />
      </div>
      <div className="input-boxx">
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FaLock className="icon" />
      </div>
      <div className="remember-forgot">
        <label><input type="checkbox" /> Remember me</label>
        <Link to="/forgot" className="custom-link">Forgot password?</Link>
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</body>

    );
};

export default Login;
