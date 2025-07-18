// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, config);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || 'Failed to fetch user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading user data...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
  if (!user) return <div style={{ textAlign: 'center', marginTop: '50px' }}>No user data available.</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome to your Dashboard, {user.username}!</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>This is where you'll see your uploaded theses and other relevant information.</p>
      {/* Later, we'll add content for specific roles (student, supervisor, admin) */}
    </div>
  );
}

export default Dashboard;