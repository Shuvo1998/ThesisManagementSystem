// frontend/src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // useNavigate is no longer needed here for direct redirect
import '../styles/AuthForms.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // const navigate = useNavigate(); // This line can be removed as we are using window.location.href

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData);
      setMessage(res.data.message || 'Login successful!');
      setError('');
      
      // Save the token to localStorage immediately
      localStorage.setItem('token', res.data.token);

      console.log('Login successful. Forcing full page load to dashboard...');
      
      // *** Use window.location.href to force a full page load to the dashboard ***
      // This is the most reliable way to ensure the Navbar and all components re-initialize
      window.location.href = '/dashboard'; 

    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setMessage('');
    }
  };
  
  return (
    <div className="auth-form-container">
      <h2>লগইন (Login)</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">ইমেইল (Email):</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">পাসওয়ার্ড (Password):</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">লগইন (Login)</button>
      </form>
      <p className="form-footer-text">
        একাউন্ট নেই? (No account?) <Link to="/register">এখানে রেজিস্টার করুন (Register here)</Link>
      </p>
    </div>
  );
}

export default Login;