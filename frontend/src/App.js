// frontend/src/App.js এর সংশ্লিষ্ট অংশ

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import AppNavbar from './components/AppNavbar'; // AppNavbar নামে ইম্পোর্ট করা হয়েছে

import UploadThesis from './pages/UploadThesis';
import Home from './pages/Home'; // <<< Home কম্পোনেন্ট ইম্পোর্ট করুন

function App() {
  return (
    <Router>
      <AppNavbar />
      {/* App.js থেকে গ্লোবাল .container div টি সরিয়ে প্রতিটি পেজের ভেতরে Container কম্পোনেন্ট ব্যবহার করা হবে।
         এতে Home পেজের Hero সেকশনটি full width হবে।
      */}
      {/* <div className="container"> */} 
        <Routes>
          <Route path="/" element={<Home />} /> {/* <<< এটি হোম পেজ হিসেবে সেট করা হলো */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload-thesis" element={<UploadThesis />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* Add other routes here */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
          {/* Private Routes 
          <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
          <Route path="/profile" element={<PrivateRoute component={Profile} />} />
          <Route path="/upload-thesis" element={<PrivateRoute component={UploadThesis} />} />
          */}
          {/* Admin Route */}
          {/*<Route path="/admin" element={<AdminRoute component={AdminPanel} />} />*/}
          
       
      {/* </div> */}
    </Router>
  );
}

export default App;