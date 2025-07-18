// frontend/src/components/Navbar.js
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  // Initialize token directly from localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to fetch and update user status (token, role)
  // Memoized with useCallback to prevent unnecessary re-creation
  const fetchUserStatus = useCallback(async () => {
    const currentToken = localStorage.getItem('token'); // Always get the latest token from localStorage
    
    // Update the token state to trigger conditional rendering
    setToken(currentToken); 

    if (currentToken) {
      try {
        const config = {
          headers: {
            'x-auth-token': currentToken,
          },
        };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, config);
        setUserRole(res.data.role);
        setIsAdmin(res.data.role === 'admin');

      } catch (err) {
        console.error('Navbar: Error fetching user status or token expired:', err.response ? err.response.data : err.message);
        // If token is invalid or an error occurs, remove it from localStorage and reset states
        localStorage.removeItem('token');
        setToken(null);
        setUserRole(null);
        setIsAdmin(false);
      }
    } else {
      // If no token in localStorage
      setToken(null);
      setUserRole(null);
      setIsAdmin(false);
    }
  }, []); // No external dependencies for this function, so safe with empty dependency array.

  // useEffect to fetch status on component mount and when localStorage changes
  useEffect(() => {
    fetchUserStatus(); // Call once on component mount

    // 'storage' event listener for when localStorage changes (e.g., from another tab/window)
    const handleStorageChange = (event) => {
      // Re-fetch only if the 'token' key changes or localStorage is cleared
      if (event.key === 'token' || event.key === null) {
        fetchUserStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup function: remove event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchUserStatus]); // `fetchUserStatus` is memoized, so it won't cause issues here.

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    // Immediately set states to null/false
    setToken(null);
    setUserRole(null);
    setIsAdmin(false);
    // Reload the browser to ensure Navbar state updates correctly and navigates to login page
    window.location.reload(); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Thesis Hub
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">Home</Link>
          </li>
          {token ? ( // Show these links if token exists (user is logged in)
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-links">Dashboard</Link>
              </li>
              {userRole === 'user' && ( // Show Upload Thesis only if user role is 'user'
                <li className="nav-item">
                  <Link to="/upload" className="nav-links">Upload Thesis</Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/profile" className="nav-links">Profile</Link>
              </li>
              {isAdmin && ( // Show Admin Panel only if admin
                <li className="nav-item">
                  <Link to="/admin" className="nav-links">Admin</Link>
                </li>
              )}
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links nav-button">Logout</button>
              </li>
            </>
          ) : ( // Show these links if no token (user is logged out)
            <>
              <li className="nav-item">
                <Link to="/register" className="nav-links">Register</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-links">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;