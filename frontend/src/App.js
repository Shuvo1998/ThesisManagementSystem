import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register'; // <<-- ইম্পোর্ট করুন
import Login from './pages/Login';     // <<-- ইম্পোর্ট করুন
import Dashboard from './pages/Dashboard'; // পরে যোগ হবে
// import ThesisUpload from './pages/ThesisUpload'; // পরে যোগ হবে
// import AdminPanel from './pages/AdminPanel'; // পরে যোগ হবে

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container" style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} /> {/* <<-- রুট যোগ করুন */}
          <Route path="/login" element={<Login />} />     {/* <<-- রুট যোগ করুন */}
          {/* TODO: Add other routes here */}
          <Route path="/dashboard" element={<Dashboard />} /> 
          {/* <Route path="/upload" element={<ThesisUpload />} /> */}
          {/* <Route path="/admin" element={<AdminPanel />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;