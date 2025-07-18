// frontend/src/pages/AdminPanel.js
import React, { useEffect, useState, useCallback } from 'react'; // useCallback যোগ করা হয়েছে
import axios from 'axios';
import '../styles/AdminPanel.css';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [theses, setTheses] = useState([]); // থিসিসের স্টেট যোগ করা হয়েছে
  const [loadingUsers, setLoadingUsers] = useState(true); // ইউজারের জন্য লোডিং স্টেট
  const [loadingTheses, setLoadingTheses] = useState(true); // থিসিসের জন্য লোডিং স্টেট
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // সকল ইউজার ফেচ করার ফাংশন
  const fetchUsers = useCallback(async () => { // useCallback যোগ করা হয়েছে
    setLoadingUsers(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, config);
      setUsers(res.data);
      setLoadingUsers(false);
    } catch (err) {
      console.error('Error fetching users:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to load users.');
      setLoadingUsers(false);
    }
  }, []); // ডিপেন্ডেন্সি নেই, তাই খালি array

  // সকল থিসিস ফেচ করার ফাংশন
  const fetchTheses = useCallback(async () => { // useCallback যোগ করা হয়েছে
    setLoadingTheses(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      // ব্যাকএন্ডে একটি নতুন API এন্ডপয়েন্ট লাগবে সকল থিসিস পাওয়ার জন্য
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/theses/all`, config); // 'all' এন্ডপয়েন্ট ব্যবহার করা হবে
      setTheses(res.data);
      setLoadingTheses(false);
    } catch (err) {
      console.error('Error fetching theses:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to load theses.');
      setLoadingTheses(false);
    }
  }, []); // ডিপেন্ডেন্সি নেই, তাই খালি array

  useEffect(() => {
    fetchUsers();
    fetchTheses(); // থিসিসও ফেচ করার জন্য কল করুন
  }, [fetchUsers, fetchTheses]); // useCallback ফাংশনগুলো ডিপেন্ডেন্সি হিসেবে যুক্ত করা হয়েছে

  // ইউজারের রোল আপডেট করার ফাংশন (আগের মতোই আছে)
  const handleRoleChange = async (userId, newRole) => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${userId}/role`, { role: newRole }, config);
      
      setMessage(`User role updated to ${newRole} successfully!`);
      fetchUsers(); 
    } catch (err) {
      console.error('Error updating user role:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  // থিসিস স্ট্যাটাস আপডেট করার ফাংশন (যেমন: Approve/Reject)
  const handleThesisStatusChange = async (thesisId, newStatus) => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      // ব্যাকএন্ডে থিসিস স্ট্যাটাস আপডেট করার জন্য নতুন API এন্ডপয়েন্ট লাগবে
      await axios.put(`${process.env.REACT_APP_API_URL}/api/theses/${thesisId}/status`, { status: newStatus }, config);
      
      setMessage(`Thesis status updated to ${newStatus} successfully!`);
      fetchTheses(); // স্ট্যাটাস পরিবর্তনের পর তালিকা আপডেট করতে আবার থিসিস ফেচ করুন
    } catch (err) {
      console.error('Error updating thesis status:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to update thesis status.');
    }
  };

  // থিসিস ডিলিট করার ফাংশন
  const handleDeleteThesis = async (thesisId) => {
    setMessage('');
    if (window.confirm('Are you sure you want to delete this thesis?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        // ব্যাকএন্ডে থিসিস ডিলিট করার জন্য নতুন API এন্ডপয়েন্ট লাগবে
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/theses/${thesisId}`, config);
        
        setMessage('Thesis deleted successfully!');
        fetchTheses(); // ডিলিটের পর তালিকা আপডেট করুন
      } catch (err) {
        console.error('Error deleting thesis:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || 'Failed to delete thesis.');
      }
    }
  };


  if (loadingUsers || loadingTheses) {
    return <div className="admin-panel-container">Loading data...</div>;
  }

  if (error) {
    return <div className="admin-panel-container error-message">{error}</div>;
  }

  return (
    <div className="admin-panel-container">
      <h2>অ্যাডমিন প্যানেল (Admin Panel)</h2>
      {message && <p className="success-message">{message}</p>}

      {/* ইউজার ম্যানেজমেন্ট সেকশন */}
      <section className="admin-section">
        <h3>ইউজার ম্যানেজমেন্ট (User Management)</h3>
        <table className="users-table">
          <thead>
            <tr>
              <th>ইউজার আইডি (User ID)</th>
              <th>ইমেইল (Email)</th>
              <th>রোল (Role)</th>
              <th>অ্যাকশন (Action)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === 'user' ? (
                    <button onClick={() => handleRoleChange(user._id, 'admin')} className="action-button">
                      অ্যাডমিন করুন (Make Admin)
                    </button>
                  ) : (
                    <button onClick={() => handleRoleChange(user._id, 'user')} className="action-button secondary">
                      ইউজার করুন (Make User)
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* থিসিস ম্যানেজমেন্ট সেকশন */}
      <section className="admin-section">
        <h3>থিসিস ম্যানেজমেন্ট (Thesis Management)</h3>
        <table className="users-table"> {/* একই টেবিল ক্লাস ব্যবহার করা হয়েছে, তুমি চাইলে নতুন CSS ক্লাস দিতে পারো */}
          <thead>
            <tr>
              <th>টাইটেল (Title)</th>
              <th>লেখক (Author)</th>
              <th>স্ট্যাটাস (Status)</th>
              <th>আপলোডার (Uploader)</th>
              <th>আপলোড তারিখ (Upload Date)</th>
              <th>অ্যাকশন (Action)</th>
            </tr>
          </thead>
          <tbody>
            {theses.map((thesis) => (
              <tr key={thesis._id}>
                <td>{thesis.title}</td>
                <td>{thesis.author}</td>
                <td>{thesis.status}</td>
                <td>{thesis.user ? thesis.user.email : 'N/A'}</td> {/* ইউজারের ইমেইল দেখানোর জন্য */}
                <td>{new Date(thesis.uploadDate).toLocaleDateString()}</td>
                <td>
                  {thesis.status === 'pending' && (
                    <>
                      <button onClick={() => handleThesisStatusChange(thesis._id, 'approved')} className="action-button">
                        Approve
                      </button>
                      <button onClick={() => handleThesisStatusChange(thesis._id, 'rejected')} className="action-button secondary">
                        Reject
                      </button>
                    </>
                  )}
                  {thesis.status !== 'pending' && (
                     <button onClick={() => handleThesisStatusChange(thesis._id, 'pending')} className="action-button secondary">
                        Mark Pending
                    </button>
                  )}
                  {/* থিসিস ডিলিট বা এডিট করার বাটন, পরে যুক্ত করা হবে */}
                  <button onClick={() => handleDeleteThesis(thesis._id)} className="action-button delete">
                    Delete
                  </button>
                  {/* <Link to={`/admin/theses/edit/${thesis._id}`} className="action-button">Edit</Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminPanel;