// frontend/src/components/AppNavbar.js
import React, { useState, useEffect, useRef } from 'react'; // useRef ইম্পোর্ট করুন
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap'; // NavDropdown এখন ব্যবহার না হলে বাদ দিতে পারেন
import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/AppNavbar.css';

function AppNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false); // Navbar এর কলাপ্সড স্টেট ম্যানেজ করার জন্য নতুন স্টেট

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      setIsAuthenticated(!!token);
      setUserRole(role || '');
    };

    window.addEventListener('storage', checkAuth);
    checkAuth();

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole('');
    navigate('/login');
    setExpanded(false); // লগআউট এর পর নেভিগেশন মেনু বন্ধ করে দাও
  };

  // নেভিগেশন লিঙ্কে ক্লিক করলে মেনু কলাপ্স করার ফাংশন
  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleNavLinkClick}>Thesis Hub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              className={({ isActive }) => (isActive ? 'active-nav-link' : '')}
              end
              onClick={handleNavLinkClick} 
            >
              Home
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? 'active-nav-link' : '')}
                  onClick={handleNavLinkClick} 
                >
                  Dashboard
                </Nav.Link>
                
                <Nav.Link
                  as={NavLink}
                  to="/upload-thesis"
                  className={({ isActive }) => (isActive ? 'active-nav-link' : '')}
                  onClick={handleNavLinkClick} 
                >
                  Upload Thesis
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/profile"
                  className={({ isActive }) => (isActive ? 'active-nav-link' : '')}
                  onClick={handleNavLinkClick} 
                >
                  Profile
                </Nav.Link>

                {userRole === 'admin' && (
                  <Nav.Link
                    as={NavLink}
                    to="/admin"
                    className={({ isActive }) => (isActive ? 'active-nav-link' : '')}
                    onClick={handleNavLinkClick} 
                  >
                    Admin
                  </Nav.Link>
                )}
                
                <Nav.Link onClick={onLogout} href="#">Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/register"
                  className={({ isActive }) => (isActive ? 'active-nav-link' : '')}
                  onClick={handleNavLinkClick} 
                >
                  Register
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  className={({ isActive }) => (isActive ? 'active-nav-link' : '')}
                  onClick={handleNavLinkClick} 
                >
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;