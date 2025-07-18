// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [theses, setTheses] = useState([]); // State to store theses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in.');
          setLoading(false);
          navigate('/login'); // Redirect if no token
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        // Fetch user data
        const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, config);
        setUser(userRes.data);

        // Fetch all theses
        const thesesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/theses`, config); // Or without config if public
        setTheses(thesesRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || 'Failed to fetch data.');
        setLoading(false);
        // If token is invalid or expired, redirect to login
        if (err.response && err.response.status === 401) {
            navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]); // Add navigate to dependency array

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading data...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {user && (
        <>
          <h2>Welcome to your Dashboard, {user.username}!</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <hr style={{ margin: '30px auto', width: '80%' }} />
        </>
      )}

      <h3>Available Theses</h3>
      {theses.length === 0 ? (
        <p>No theses available yet. Upload one!</p>
      ) : (
        <div className="thesis-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          {theses.map((thesis) => (
            <div key={thesis._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', width: '300px', textAlign: 'left', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <h4>{thesis.title}</h4>
              <p><strong>Authors:</strong> {thesis.authors.join(', ')}</p>
              <p><strong>Department:</strong> {thesis.department}</p>
              <p><strong>Uploaded by:</strong> {thesis.uploadedBy ? thesis.uploadedBy.username : 'N/A'}</p>
              <p><strong>Status:</strong> {thesis.status}</p>
              <p><strong>Keywords:</strong> {thesis.keywords && thesis.keywords.length > 0 ? thesis.keywords.join(', ') : 'N/A'}</p>
              <a href={`${process.env.REACT_APP_API_URL}/${thesis.filePath}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '10px', padding: '8px 12px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                View PDF
              </a>
              {/* You can add a download button or more details here */}
              {/* <a href={`${process.env.REACT_APP_API_URL}/api/theses/download/${thesis._id}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px', backgroundColor: '#28a745', color: 'white', padding: '8px 12px', borderRadius: '5px', textDecoration: 'none' }}>
                  Download PDF
              </a> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;