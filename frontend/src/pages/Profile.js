// frontend/src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css'; // New CSS file for profile

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in.');
          setLoading(false);
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        // Fetch user data from the backend
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, config);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || 'Failed to fetch profile data.');
        setLoading(false);
        // Redirect to login page if token is invalid
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]); // Add navigate to dependency array

  if (loading) return <div className="profile-container">Loading profile...</div>;
  if (error) return <div className="profile-container error-message">Error: {error}</div>;
  if (!user) return <div className="profile-container">No user data available.</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        {/* Role-based content */}
        {user.role === 'user' && ( // For regular users
          <div className="role-specific-info">
            <h4>Student/Researcher Information:</h4>
            <p>You can view your uploaded theses on the Dashboard.</p>
          </div>
        )}
        {user.role === 'admin' && ( // For administrators
          <div className="role-specific-info">
            <h4>Admin Information:</h4>
            <p>You can manage users and theses in the Admin Panel.</p>
            {/* Additional admin-specific info */}
          </div>
        )}
        {/* In the future, you can add roles like 'supervisor' or 'reviewer' and add specific content here */}
      </div>
      {/* <button className="edit-profile-btn">Edit Profile (Future)</button> */}
    </div>
  );
}

export default Profile;