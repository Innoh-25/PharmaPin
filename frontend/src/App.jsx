import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route , useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Components
import Navbar from './components/Layout/Navbar';
import Home from './components/Pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PharmacistLayout from './components/Layout/PharmacistLayout';
import PharmacyOnboarding from './components/Pharmacist/PharmacyOnboarding';
import PendingApproval from './components/Pharmacist/PendingApproval';
import PharmacistDashboard from './components/Pharmacist/PharmacistDashboard';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';

const ProtectedAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/secure-admin-access');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/admin/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/secure-admin-access');
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/secure-admin-access');
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Verifying Admin Access...</p>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Pharmacist Routes - Nested under /pharmacist */}
            <Route path="/pharmacist" element={<PharmacistLayout />}>
              <Route path="onboarding" element={<PharmacyOnboarding />} />
              <Route path="pending-approval" element={<PendingApproval />} />
              <Route path="dashboard" element={<PharmacistDashboard />} />
            </Route>

            <Route path="/secure-admin-access" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;