// frontend/src/pages/Dashboard.js
import React, { useEffect, useState, useCallback } from 'react'; // useCallback যোগ করুন
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // নতুন CSS ফাইল

function Dashboard() {
  const [user, setUser] = useState(null);
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // সার্চ কোয়েরি স্টেট
  const [filterDepartment, setFilterDepartment] = useState(''); // ডিপার্টমেন্ট ফিল্টার স্টেট
  const [filterStatus, setFilterStatus] = useState(''); // স্ট্যাটাস ফিল্টার স্টেট (যদি সব থিসিস দেখান)
  const navigate = useNavigate();

  const fetchTheses = useCallback(async (search = '', department = '', status = '') => {
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

      // Fetch user data (always needed for dashboard)
      const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, config);
      setUser(userRes.data);

      // Fetch theses with search and filter parameters
      const params = {};
      if (search) params.search = search;
      if (department) params.department = department;
      if (status) params.status = status; // Add status filter

      const thesesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/theses`, {
        ...config, // Merge headers
        params: params, // Add query parameters
      });
      setTheses(thesesRes.data);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to fetch data.');
      setLoading(false);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
      }
    }
  }, [navigate]); // useCallback dependencies

  useEffect(() => {
    fetchTheses(searchQuery, filterDepartment, filterStatus);
  }, [fetchTheses, searchQuery, filterDepartment, filterStatus]); // Effect dependencies

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDepartmentFilterChange = (e) => {
    setFilterDepartment(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  if (loading) return <div className="dashboard-container">Loading data...</div>;
  if (error) return <div className="dashboard-container error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      {user && (
        <>
          <h2>স্বাগতম {user.username}!</h2>
          <p>ইমেইল: {user.email}</p>
          <p>ভূমিকা: {user.role}</p>
          <hr style={{ margin: '30px auto', width: '80%' }} />
        </>
      )}

      <div className="filters-section">
        <input
          type="text"
          placeholder="সার্চ করুন (টাইটেল, অ্যাবস্ট্রাক্ট, লেখক, কিওয়ার্ডস)"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select
          value={filterDepartment}
          onChange={handleDepartmentFilterChange}
          className="filter-select"
        >
          <option value="">সকল ডিপার্টমেন্ট</option>
          <option value="CSE">কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)</option>
          <option value="EEE">ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং (EEE)</option>
          <option value="CE">সিভিল ইঞ্জিনিয়ারিং (CE)</option>
          <option value="ME">মেকানিক্যাল ইঞ্জিনিয়ারিং (ME)</option>
          <option value="BBA">ব্যাচেলর অফ বিজনেস অ্যাডমিনিস্ট্রেশন (BBA)</option>
          {/* প্রয়োজন অনুযায়ী আরও ডিপার্টমেন্ট যোগ করুন */}
        </select>
        <select
          value={filterStatus}
          onChange={handleStatusFilterChange}
          className="filter-select"
        >
          <option value="">সকল স্ট্যাটাস</option>
          <option value="pending">পেন্ডিং</option>
          <option value="approved">অনুমোদিত</option>
          <option value="rejected">প্রত্যাখ্যাত</option>
        </select>
      </div>

      <h3>উপলব্ধ থিসিস</h3>
      {theses.length === 0 ? (
        <p>এখনো কোনো থিসিস উপলব্ধ নেই। একটি আপলোড করুন অথবা আপনার ফিল্টার/সার্চ পরিবর্তন করুন।</p>
      ) : (
        <div className="thesis-list">
          {theses.map((thesis) => (
            <div key={thesis._id} className="thesis-card">
              <h4>{thesis.title}</h4>
              <p><strong>লেখক:</strong> {thesis.authors.join(', ')}</p>
              <p><strong>ডিপার্টমেন্ট:</strong> {thesis.department}</p>
              <p><strong>আপলোড করেছেন:</strong> {thesis.uploadedBy ? thesis.uploadedBy.username : 'N/A'}</p>
              <p><strong>স্ট্যাটাস:</strong> {thesis.status}</p>
              {thesis.keywords && thesis.keywords.length > 0 && (
                <p><strong>কিওয়ার্ডস:</strong> {thesis.keywords.join(', ')}</p>
              )}
              <a href={`${process.env.REACT_APP_API_URL}/${thesis.filePath}`} target="_blank" rel="noopener noreferrer" className="view-pdf-btn">
                পিডিএফ দেখুন
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;