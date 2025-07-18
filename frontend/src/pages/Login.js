// frontend/src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForms.css'; // স্টাইলিং এর জন্য

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      localStorage.setItem('token', res.data.token); // টোকেন সেভ হচ্ছে কিনা নিশ্চিত করুন

      console.log('Login successful. Attempting to navigate to /dashboard...'); // <<< এই লাইনটি যোগ করুন

      // গুরুত্বপূর্ণ: window.location.reload() লাইনটি থাকলে এটিকে কমেন্ট আউট করে দিন
      // কারণ এটি navigate() কে বাধা দিতে পারে।
      // window.location.reload(); // <<< যদি এই লাইনটি থাকে, তবে এটিকে কমেন্ট আউট করুন

      // 1 সেকেন্ড পর ড্যাশবোর্ডে রিডাইরেক্ট করবে
      setTimeout(() => {
        navigate('/dashboard'); // <<< এই লাইনটি আছে এবং সঠিকভাবে কল হচ্ছে কিনা নিশ্চিত করুন
      }, 1000); // 1 সেকেন্ড বিলম্ব

    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setMessage('');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;