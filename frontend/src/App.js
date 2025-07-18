// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ThesisUpload from './pages/ThesisUpload';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile'; // <<< Import this line

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container" style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<ThesisUpload />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/profile" element={<Profile />} /> {/* <<< Add this route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;