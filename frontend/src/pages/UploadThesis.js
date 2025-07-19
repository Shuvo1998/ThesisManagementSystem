// frontend/src/pages/UploadThesis.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'; // <<< এই লাইনটি আপডেট করুন
//import '../styles/UploadThesis.css'; // যদি কোনো কাস্টম CSS থাকে

function UploadThesis() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    abstract: '',
    year: '',
    department: '',
    fileUrl: '', // আপাতত URL স্টোর করা হবে
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { title, author, abstract, year, department, fileUrl } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/theses`, formData, config);
      
      setMessage('Thesis uploaded successfully! It is now pending for admin approval.');
      setFormData({
        title: '',
        author: '',
        abstract: '',
        year: '',
        department: '',
        fileUrl: '',
      });
      // Optionally, navigate to dashboard or a success page
      // navigate('/dashboard'); 
    } catch (err) {
      console.error('Error uploading thesis:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to upload thesis. Please try again.');
      // যদি ভ্যালিডেশন এরর থাকে, সেগুলো ইউজারকে দেখানো যেতে পারে
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
              as="textarea" // textarea এর জন্য as="textarea" ব্যবহার করা হয়
              name="abstract"
              value={abstract}
              onChange={onChange}
              placeholder="Provide a brief abstract of the thesis"
              rows={5} // Rows prop for textarea
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

          <Form.Group controlId="formFileUrl" className="mb-3">
            <Form.Label>File URL (e.g., Google Drive link, Dropbox link)</Form.Label>
            <Form.Control
              type="url"
              name="fileUrl"
              value={fileUrl}
              onChange={onChange}
              placeholder="Paste your thesis file URL here"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Upload Thesis
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default UploadThesis;