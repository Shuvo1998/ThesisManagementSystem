// frontend/src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
//import '../styles/Login.css'; // যদি কোনো কাস্টম CSS থাকে

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        try {
            // *** এখানে পরিবর্তন করতে হবে ***
            // `REACT_APP_API_URL` কে `REACT_APP_BACKEND_URL` এ পরিবর্তন করুন
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, formData);

            localStorage.setItem('token', res.data.token);
            // Note: Your backend returns `token` but not `role` directly in the login response
            // The backend authController.js has: res.json({ token, message: 'Logged in successfully!' });
            // You might need to adjust your backend's login response to include `role`
            // if you intend to store it directly from here.
            // For now, let's remove it if the backend doesn't send it.
            // localStorage.setItem('role', res.data.role); // <-- এটি কমেন্ট করে রাখলাম, যদি backend role না পাঠায়

            navigate('/dashboard'); // Redirect to dashboard after successful login
            window.location.reload(); // Force a full page reload to update Navbar state
        } catch (err) {
            console.error('Login error:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.'); // Display error from backend
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Login</h2>
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                <Form onSubmit={onSubmit}>
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

                    <Button variant="primary" type="submit" className="w-100">
                        Login
                    </Button>
                </Form>
                <p className="text-center mt-3">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </Card>
        </Container>
    );
}

export default Login;