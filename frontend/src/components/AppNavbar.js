// frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap'; // <<< এই লাইনটি আপডেট করুন
import 'bootstrap/dist/css/bootstrap.min.css'; // Navbar এর জন্য এখানেও ইম্পোর্ট করা যেতে পারে, তবে index.js এ থাকলে দরকার নেই

function AppNavbar() { // কম্পোনেন্টের নাম Navbar থেকে AppNavbar এ পরিবর্তন করা হলো যাতে React-Bootstrap এর Navbar এর সাথে কনফ্লিক্ট না হয়
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole('');
    }
  }, []); // এখন শুধুমাত্র একবার চেক করবে, পরবর্তীতে অথেন্টিকেশন স্টেট পরিবর্তন হলে manually আপডেট করতে হবে

  // অথেন্টিকেশন স্টেট পরিবর্তনের জন্য একটি প্রভাব (effect) যোগ করা
  // যাতে লগইন/লগআউট এর পর Navbar আপডেট হয়।
  // আমরা localStorage এর token বা role পরিবর্তনের জন্য একটি ইভেন্ট লিসেনারও যোগ করতে পারতাম,
  // তবে সহজ রাখার জন্য, এখন এই ইফেক্টটি রাখছি।
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      setIsAuthenticated(!!token); // !!token ensures boolean true/false
      setUserRole(role || '');
    };

    // Listen for storage changes (useful for login/logout in different tabs)
    window.addEventListener('storage', checkAuth);
    // Also check on component mount
    checkAuth();

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []); // Empty dependency array, so it runs once on mount and cleans up on unmount


  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole('');
    navigate('/login');
    // window.location.reload(); // এটি Bootstrap Navbar এর সাথে অপ্রয়োজনীয় হতে পারে, কারণ স্টেট আপডেটেড
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4"> {/* mb-4 adds margin-bottom */}
      <Container>
        <Navbar.Brand as={Link} to="/">Thesis Hub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"> {/* me-auto pushes links to the left, use ms-auto for right */}
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link as={Link} to="/upload-thesis">Upload Thesis</Nav.Link>
                {userRole === 'admin' && (
                  <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                )}
                {/* Logout as a regular Nav.Link or a Button inside Nav */}
                <Nav.Link onClick={onLogout} href="#">Logout</Nav.Link>
                {/* যদি Dropdown ব্যবহার করতে চাও, তাহলে এমন হতে পারে:
                <NavDropdown title="Account" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  {userRole === 'admin' && (
                    <NavDropdown.Item as={Link} to="/admin">Admin Panel</NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
                */}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar; // কম্পোনেন্টের নাম AppNavbar এক্সপোর্ট করা হয়েছে