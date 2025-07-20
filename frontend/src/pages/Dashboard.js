// frontend/src/pages/Dashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Table } from 'react-bootstrap';
//import '../styles/Dashboard.css'; // যদি কোনো কাস্টম CSS থাকে

function Dashboard() {
    const [approvedTheses, setApprovedTheses] = useState([]);
    const [myTheses, setMyTheses] = useState([]);
    const [loadingApproved, setLoadingApproved] = useState(true);
    const [loadingMyTheses, setLoadingMyTheses] = useState(false);
    const [errorApproved, setErrorApproved] = useState(null);
    const [errorMyTheses, setErrorMyTheses] = useState(null);

    const isAuthenticated = localStorage.getItem('token');

    const fetchApprovedTheses = useCallback(async () => {
        setLoadingApproved(true);
        setErrorApproved(null);
        try {
            // *** এখানে পরিবর্তন করতে হবে ***
            // `REACT_APP_API_URL` কে `REACT_APP_BACKEND_URL` এ পরিবর্তন করুন
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/theses`);
            setApprovedTheses(res.data);
            setLoadingApproved(false);
        } catch (err) {
            console.error('Error fetching approved theses for dashboard:', err.response ? err.response.data : err.message);
            setErrorApproved(err.response?.data?.message || 'Failed to load approved theses.');
            setLoadingApproved(false);
        }
    }, []);

    const fetchMyTheses = useCallback(async () => {
        if (!isAuthenticated) {
            setLoadingMyTheses(false);
            return;
        }
        setLoadingMyTheses(true);
        setErrorMyTheses(null);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token,
                },
            };
            // *** এখানে পরিবর্তন করতে হবে ***
            // `REACT_APP_API_URL` কে `REACT_APP_BACKEND_URL` এ পরিবর্তন করুন
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/theses/me`, config);
            setMyTheses(res.data);
            setLoadingMyTheses(false);
        } catch (err) {
            console.error('Error fetching my theses:', err.response ? err.response.data : err.message);
            setErrorMyTheses(err.response?.data?.message || 'Failed to load your theses.');
            setLoadingMyTheses(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchApprovedTheses();
        fetchMyTheses();
    }, [fetchApprovedTheses, fetchMyTheses]);

    return (
        <Container className="my-4"> {/* Add some margin top/bottom */}
            {/* My Theses Section */}
            {isAuthenticated && (
                <>
                    <h2 className="mb-3">My Theses</h2>
                    {loadingMyTheses ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading your theses...</span>
                            </Spinner>
                            <p>Loading your theses...</p>
                        </div>
                    ) : errorMyTheses ? (
                        <Alert variant="danger" className="text-center">{errorMyTheses}</Alert>
                    ) : myTheses.length === 0 ? (
                        <Alert variant="info" className="text-center">You have not uploaded any theses yet.</Alert>
                    ) : (
                        <Table striped bordered hover responsive className="mb-5"> {/* Added Bootstrap classes and responsive */}
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Department</th>
                                    <th>Year</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTheses.map((thesis) => (
                                    <tr key={thesis._id}>
                                        <td>{thesis.title}</td>
                                        <td>{thesis.author}</td>
                                        <td>{thesis.department}</td>
                                        <td>{thesis.year}</td>
                                        <td>{thesis.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    <hr className="my-5" /> {/* Add more vertical spacing */}
                </>
            )}

            {/* Approved Theses Section */}
            <h2 className="mb-3">Approved Theses (Public)</h2>
            {loadingApproved ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading approved theses...</span>
                    </Spinner>
                    <p>Loading approved theses...</p>
                </div>
            ) : errorApproved ? (
                <Alert variant="danger" className="text-center">{errorApproved}</Alert>
            ) : approvedTheses.length === 0 ? (
                <Alert variant="info" className="text-center">No approved theses found yet. Please check the Admin Panel to approve some theses.</Alert>
            ) : (
                <Table striped bordered hover responsive> {/* Added Bootstrap classes and responsive */}
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
                        {approvedTheses.map((thesis) => (
                            <tr key={thesis._id}>
                                <td>{thesis.title}</td>
                                <td>{thesis.author}</td>
                                <td>{thesis.department}</td>
                                <td>{thesis.year}</td>
                                <td>{thesis.user ? thesis.user.email : 'N/A'}</td>
                                <td>{thesis.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default Dashboard;