// frontend/src/pages/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
//import '../styles/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    // Add username field here
    username: '', // <<< Add this line
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { username, email, password, confirmPassword } = formData; // <<< Destructure username also

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send username along with email and password
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, { username, email, password }); // <<< Pass username here
      
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Register</h2>
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          {/* Add Username Input Field */}
          <Form.Group controlId="formBasicUsername" className="mb-3"> {/* <<< Add this group */}
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </Form.Group>
          {/* End Username Input Field */}

          <Form.Group controlId="formBasicEmail" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>
        </Form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </Card>
    </Container>
  );
}

export default Register;