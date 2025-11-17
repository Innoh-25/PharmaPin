import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route , useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';
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
import ManageInventory from './components/Pharmacist/ManageInventory';
import ViewOrders from './components/Pharmacist/ViewOrders';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import RejectedPharmacy from './components/Pharmacist/RejectedPharmacy';
import DrugClassManager from './components/Pharmacist/DrugClassManager';
import InventoryDrugs from './components/Pharmacist/InventoryDrugs';
import Profile from './components/Pharmacist/Profile'

//Patient
import PatientLayout from './components/Shared/Layout/PatientLayout';
import PatientDashboard from './components/Patient/Dashboard/PatientDashboard';
import DrugSearch from './components/Patient/Search/DrugSearch';
import SearchResults from './components/Patient/Search/SearchResults';
import PharmacyDetail from './components/Patient/PharmacyDetail';
import Checkout from './components/Patient/Checkout';
import OrderTracking from './components/Patient/OrderTracking';
import PatientProfile from './components/Patient/Profile';
import HelpSupport from './components/Patient/HelpSupport';
import OrderHistory from './components/Patient/Orders/OrderHistory';
import OrderDetails from './components/Patient/Orders/OrderDetails';
import DrugDetails from './components/Patient/DrugDetails/DrugDetails';
import NotificationsList from './components/Patient/Notifications/NotificationsList'

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
          {/* <Navbar /> */}
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
              <Route path="rejected" element={<RejectedPharmacy />} />
              <Route path="inventory" element={<ManageInventory />} />
              <Route path="orders" element={<ViewOrders />} />
              <Route path="manage-drugs" element={<DrugClassManager />} />
              <Route path="inventory-drugs" element={<InventoryDrugs />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin routes */}
            <Route path="/secure-admin-access" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Patient routes */}

            <Route path="/patient" element={<PatientLayout />}>
              <Route index element={<PatientDashboard />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="search" element={<DrugSearch />} />
              <Route path="search-results" element={<SearchResults />} />
              <Route path="pharmacy/:id" element={<PharmacyDetail />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="orders/:id/tracking" element={<OrderTracking />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="help" element={<HelpSupport />} />
              <Route path="drug-details" element={<DrugDetails />} />
              <Route path="notifications" element={<NotificationsList />} />
            </Route>

            {/* Standalone patient routes for direct access */}
            {/* <Route path="/search" element={
              <PatientLayout>
                <DrugSearch />
              </PatientLayout>
            } /> */}
            <Route path="/drugs/:id" element={
              <PatientLayout>
                <PharmacyDetail />
              </PatientLayout>
            } />

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;