// frontend/src/pages/AdminPanel.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Container, Spinner, Alert, Table, Button, Dropdown } from 'react-bootstrap'; // <<< Table, Button, Dropdown ইম্পোর্ট করুন
//import '../styles/AdminPanel.css'; // যদি কোনো কাস্টম CSS থাকে

function AdminPanel() {
  const [theses, setTheses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'x-auth-token': token,
    },
  };

  const fetchUsersAndTheses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const usersRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/all`, config);
      setUsers(usersRes.data);

      const thesesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/theses/all`, config);
      setTheses(thesesRes.data);

      setLoading(false);
    } catch (err) {
      console.error('Admin Panel fetch error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to load admin data.');
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    fetchUsersAndTheses();
  }, [fetchUsersAndTheses]);

  const handleThesisStatusChange = async (id, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/theses/${id}/status`, { status }, config);
      fetchUsersAndTheses(); // Refetch data to update the table
    } catch (err) {
      console.error('Error updating thesis status:', err.response ? err.response.data : err.message);
      alert(err.response?.data?.message || 'Failed to update thesis status.'); // Display alert
    }
  };

  const handleDeleteThesis = async (id) => {
    if (window.confirm('Are you sure you want to delete this thesis?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/theses/${id}`, config);
        fetchUsersAndTheses(); // Refetch data to update the table
      } catch (err) {
        console.error('Error deleting thesis:', err.response ? err.response.data : err.message);
        alert(err.response?.data?.message || 'Failed to delete thesis.'); // Display alert
      }
    }
  };

  const handleUserRoleChange = async (id, role) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${id}/role`, { role }, config);
      fetchUsersAndTheses(); // Refetch data to update the table
    } catch (err) {
      console.error('Error updating user role:', err.response ? err.response.data : err.message);
      alert(err.response?.data?.message || 'Failed to update user role.'); // Display alert
    }
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading data...</span>
        </Spinner>
        <p>Loading data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger" className="text-center">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-3">Admin Panel</h2>

      <h3 className="mt-5 mb-3">User Management</h3>
      {users.length === 0 ? (
        <Alert variant="info" className="text-center">No users found.</Alert>
      ) : (
        <Table striped bordered hover responsive className="mb-5"> {/* Bootstrap classes and responsive */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id={`dropdown-role-${user._id}`} size="sm">
                      Change Role
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleUserRoleChange(user._id, 'admin')}>Make Admin</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleUserRoleChange(user._id, 'user')}>Make User</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h3 className="mt-5 mb-3">Thesis Management</h3>
      {theses.length === 0 ? (
        <Alert variant="info" className="text-center">No theses found.</Alert>
      ) : (
        <Table striped bordered hover responsive> {/* Bootstrap classes and responsive */}
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Department</th>
              <th>Year</th>
              <th>Uploader</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {theses.map((thesis) => (
              <tr key={thesis._id}>
                <td>{thesis.title}</td>
                <td>{thesis.author}</td>
                <td>{thesis.department}</td>
                <td>{thesis.year}</td>
                <td>{thesis.user ? thesis.user.email : 'N/A'}</td>
                <td>{thesis.status}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2" // margin-end for spacing
                    onClick={() => handleThesisStatusChange(thesis._id, 'approved')}
                    disabled={thesis.status === 'approved'}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleThesisStatusChange(thesis._id, 'pending')}
                    disabled={thesis.status === 'pending'}
                  >
                    Pending
                  </Button>
                  <Button
                    variant="info" // Changed to info for rejected
                    size="sm"
                    className="me-2"
                    onClick={() => handleThesisStatusChange(thesis._id, 'rejected')}
                    disabled={thesis.status === 'rejected'}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteThesis(thesis._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default AdminPanel;