import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UploadThesis() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    abstract: '',
    department: '',
    supervisor: '',       // নতুন যোগ করা হয়েছে
    publicationYear: '',  // নতুন যোগ করা হয়েছে
    university: '',       // নতুন যোগ করা হয়েছে
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { title, author, abstract, department, supervisor, publicationYear, university } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(null);

    if (!selectedFile) {
      setError('Please select a thesis file to upload.');
      return;
    }

    // সমস্ত প্রয়োজনীয় ফিল্ডের জন্য ক্লায়েন্ট-সাইড ভ্যালিডেশন
    if (!title || !author || !abstract || !department || !supervisor || !publicationYear || !university) {
      setError('Please fill in all required fields: Title, Author, Abstract, Department, Supervisor, Publication Year, and University.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const data = new FormData();
      data.append('title', title);
      data.append('author', author);
      data.append('abstract', abstract);
      data.append('department', department);
      data.append('supervisor', supervisor);
      data.append('publicationYear', publicationYear);
      data.append('university', university); // FormData তে যোগ করা হয়েছে
      data.append('pdfFile', selectedFile); // নিশ্চিত করুন 'pdfFile' নামটি ব্যাকএন্ডের Multer সেটিং এর সাথে মিলে যায়

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      };

      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/theses/upload`, data, config);

      setMessage('Thesis uploaded successfully! It is now pending for admin approval.');
      // ফর্ম রিসেট করুন
      setFormData({
        title: '',
        author: '',
        abstract: '',
        department: '',
        supervisor: '',
        publicationYear: '',
        university: '',
      });
      setSelectedFile(null);
      // সফল আপলোডের পর ব্যবহারকারীকে ড্যাশবোর্ডে নিয়ে যেতে পারেন
      // navigate('/dashboard'); 
    } catch (err) {
      console.error('Error uploading thesis:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to upload thesis. Please try again.');
      // যদি ব্যাকএন্ড থেকে ভ্যালিডেশন এরর আসে (যেমন Joi বা Express Validator থেকে)
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map(errorItem => errorItem.msg).join(', '));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5 upload-thesis-container">
      <Card className="p-4 shadow-lg">
        <h2 className="text-center mb-4">Upload New Thesis</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Thesis Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter thesis title"
              name="title"
              value={title}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAuthor">
            <Form.Label>Author(s)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter author(s) name"
              name="author"
              value={author}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAbstract">
            <Form.Label>Abstract</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter thesis abstract"
              name="abstract"
              value={abstract}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDepartment">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department name"
              name="department"
              value={department}
              onChange={onChange}
              required
            />
          </Form.Group>

          {/* Supervisor Field */}
          <Form.Group className="mb-3" controlId="formSupervisor">
            <Form.Label>Supervisor</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter supervisor's name"
              name="supervisor"
              value={supervisor}
              onChange={onChange}
              required
            />
          </Form.Group>

          {/* Publication Year Field */}
          <Form.Group className="mb-3" controlId="formPublicationYear">
            <Form.Label>Publication Year</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 2024"
              name="publicationYear"
              value={publicationYear}
              onChange={onChange}
              required
            />
          </Form.Group>

          {/* University Field */}
          <Form.Group className="mb-3" controlId="formUniversity">
            <Form.Label>University</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter university name"
              name="university"
              value={university}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPdfFile">
            <Form.Label>Upload PDF File</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
            {selectedFile && <p className="mt-2 text-muted">Selected file: {selectedFile.name}</p>}
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Upload Thesis'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default UploadThesis;