// frontend/src/pages/ThesisUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForms.css'; // Reusing some styles

function ThesisUpload() {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: '', // Comma separated string
    department: '',
    keywords: '', // Comma separated string
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { title, abstract, authors, department, keywords } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a PDF file to upload.');
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('abstract', abstract);
    data.append('authors', authors); // Send as string, backend will split
    data.append('department', department);
    data.append('keywords', keywords); // Send as string, backend will split
    data.append('thesisFile', selectedFile); // The file itself

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to upload a thesis.');
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
          'x-auth-token': token,
        },
      };

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/theses`, data, config);
      setMessage(res.data.message || 'Thesis uploaded successfully!');
      setError('');
      // Clear form after successful upload
      setFormData({
        title: '',
        abstract: '',
        authors: '',
        department: '',
        keywords: '',
      });
      setSelectedFile(null);
      // Optional: Redirect to dashboard or thesis list after upload
      // setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Thesis upload error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Thesis upload failed. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="auth-form-container"> {/* Reusing auth form styles for now */}
      <h2>Upload New Thesis</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="abstract">Abstract:</label>
          <textarea
            id="abstract"
            name="abstract"
            value={abstract}
            onChange={handleChange}
            required
            rows="5"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="authors">Authors (comma-separated):</label>
          <input
            type="text"
            id="authors"
            name="authors"
            value={authors}
            onChange={handleChange}
            placeholder="e.g., John Doe, Jane Smith"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            value={department}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="keywords">Keywords (comma-separated, optional):</label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={keywords}
            onChange={handleChange}
            placeholder="e.g., AI, Machine Learning, Robotics"
          />
        </div>
        <div className="form-group">
          <label htmlFor="thesisFile">Select PDF File:</label>
          <input
            type="file"
            id="thesisFile"
            name="thesisFile"
            accept="application/pdf" // Only allow PDF files
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Upload Thesis</button>
      </form>
    </div>
  );
}

export default ThesisUpload;