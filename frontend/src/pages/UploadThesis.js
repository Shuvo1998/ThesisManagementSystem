// frontend/src/pages/UploadThesis.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

function UploadThesis() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    abstract: '',
    year: '',
    department: '',
    // fileUrl: '', // <<< এই লাইনটি সরিয়ে দিন
  });
  const [selectedFile, setSelectedFile] = useState(null); // <<< নতুন স্টেট: ফাইল অবজেক্ট স্টোর করার জন্য
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { title, author, abstract, year, department } = formData; // <<< fileUrl বাদ দিন

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => { // <<< নতুন ফাংশন: ফাইল ইনপুটের পরিবর্তনের জন্য
    setSelectedFile(e.target.files[0]); // নির্বাচিত ফাইলটি স্টেটে রাখুন
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(null);

    // ফাইল সিলেক্ট করা হয়েছে কিনা চেক করুন
    if (!selectedFile) {
      setError('Please select a thesis file to upload.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      // ফাইল এবং অন্যান্য ফর্ম ডেটা পাঠানোর জন্য FormData ব্যবহার করুন
      const data = new FormData();
      data.append('title', title);
      data.append('author', author);
      data.append('abstract', abstract);
      data.append('year', year);
      data.append('department', department);
      data.append('thesisFile', selectedFile); // <<< 'thesisFile' নামে ফাইলটি যোগ করা হলো

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', // ফাইল আপলোডের জন্য এটি গুরুত্বপূর্ণ
          'x-auth-token': token,
        },
      };

      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/theses`, data, config);
      
      setMessage('Thesis uploaded successfully! It is now pending for admin approval.');
      setFormData({
        title: '',
        author: '',
        abstract: '',
        year: '',
        department: '',
      });
      setSelectedFile(null); // ফাইল সিলেক্ট করা স্টেট রিসেট করুন
      // Optionally, navigate to dashboard or a success page
      // navigate('/dashboard'); 
    } catch (err) {
      console.error('Error uploading thesis:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to upload thesis. Please try again.');
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map(err => err.msg).join(', '));
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow-sm" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="text-center mb-4">Upload New Thesis</h2>
        {message && <Alert variant="success" className="text-center">{message}</Alert>}
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="Thesis Title"
              required
            />
          </Form.Group>

          <Form.Group controlId="formAuthor" className="mb-3">
            <Form.Label>Author(s)</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={author}
              onChange={onChange}
              placeholder="Author(s) Name (e.g., John Doe, Jane Smith)"
              required
            />
          </Form.Group>

          <Form.Group controlId="formAbstract" className="mb-3">
            <Form.Label>Abstract</Form.Label>
            <Form.Control
              as="textarea"
              name="abstract"
              value={abstract}
              onChange={onChange}
              placeholder="Provide a brief abstract of the thesis"
              rows={5}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="formYear" className="mb-3">
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={year}
              onChange={onChange}
              placeholder="e.g., 2023"
              required
            />
          </Form.Group>

          <Form.Group controlId="formDepartment" className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={department}
              onChange={onChange}
              placeholder="e.g., Computer Science and Engineering"
              required
            />
          </Form.Group>

          {/* নতুন ফাইল আপলোড ইনপুট ফিল্ড */}
          <Form.Group controlId="formFile" className="mb-3"> {/* <<< এই গ্রুপটি যোগ করুন */}
            <Form.Label>Upload Thesis File (PDF only)</Form.Label>
            <Form.Control
              type="file"
              name="thesisFile" // এই নামটি ব্যাকএন্ডে Multer এ ব্যবহার করব
              onChange={handleFileChange}
              accept=".pdf" // শুধু PDF ফাইল গ্রহণ করবে
              required
            />
            {selectedFile && <div className="mt-2 text-muted">Selected file: {selectedFile.name}</div>}
          </Form.Group>
          {/* ফাইল আপলোড ইনপুট ফিল্ডের শেষ */}

          <Button variant="primary" type="submit" className="w-100">
            Upload Thesis
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default UploadThesis;