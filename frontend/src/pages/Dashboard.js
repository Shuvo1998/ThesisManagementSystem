// frontend/src/pages/Dashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Keep this if you plan to navigate elsewhere
import '../styles/Dashboard.css'; // Make sure this CSS file exists and has styles for the table

function Dashboard() {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate(); // Uncomment if you need to use navigate for other purposes

  // Function to fetch all approved theses for the dashboard
  const fetchApprovedTheses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // This will call the new GET /api/theses route on your backend
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/theses`);
      setTheses(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching approved theses for dashboard:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to load approved theses.');
      setLoading(false);
    }
  }, []); // Empty dependency array because it doesn't depend on external state/props

  useEffect(() => {
    fetchApprovedTheses();
  }, [fetchApprovedTheses]); // Dependency on useCallback memoized function

  if (loading) {
    return <div className="dashboard-container">Loading approved theses...</div>;
  }

  if (error) {
    return <div className="dashboard-container error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Approved Theses</h2>
      {theses.length === 0 ? (
        <p>No approved theses found yet. Please check the Admin Panel to approve some theses.</p>
      ) : (
        <table className="theses-table"> {/* You might need to define .theses-table in Dashboard.css */}
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Department</th>
              <th>Year</th>
              <th>Uploader</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {theses.map((thesis) => (
              <tr key={thesis._id}>
                <td>{thesis.title}</td>
                <td>{thesis.author}</td>
                <td>{thesis.department}</td>
                <td>{thesis.year}</td>
                <td>{thesis.user ? thesis.user.email : 'N/A'}</td> {/* Displays uploader's email */}
                <td>{thesis.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;