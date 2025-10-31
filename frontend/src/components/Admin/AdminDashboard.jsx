import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [pendingPharmacies, setPendingPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token'); // Changed from adminToken to token
      
      // Add debug logging
      console.log('Fetching admin data with token:', token ? 'present' : 'missing');
      
      const [statsRes, pendingRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/pharmacies/pending', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      console.log('Stats response:', statsRes.data);
      console.log('Pending response:', pendingRes.data);

      setStats(statsRes.data.data || {});
      setPendingPharmacies(pendingRes.data.data || []);
    } catch (error) {
      console.error('Admin data fetch error:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePharmacy = async (pharmacyId) => {
    try {
      const token = localStorage.getItem('token'); // Changed from adminToken
      await axios.put(`http://localhost:5000/api/admin/pharmacies/${pharmacyId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchAdminData();
      alert('Pharmacy approved successfully!');
    } catch (error) {
      alert('Error approving pharmacy');
    }
  };

  const handleRejectPharmacy = async (pharmacyId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        const token = localStorage.getItem('token'); // Changed from adminToken
        await axios.put(`http://localhost:5000/api/admin/pharmacies/${pharmacyId}/reject`, 
          { rejectionReason: reason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        fetchAdminData();
        alert('Pharmacy rejected');
      } catch (error) {
        alert('Error rejecting pharmacy');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/secure-admin-access');
  };

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>🏥 PharmaPin Admin</h1>
          <div className="admin-user-menu">
            <span>Welcome, {user.firstName || 'Admin'}</span>
            <button onClick={handleLogout} className="admin-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button 
          className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`admin-nav-btn ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >
          ⏳ Pending Approvals ({pendingPharmacies.length})
        </button>
      </nav>

      {/* Main Content */}
      <div className="admin-main">
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard-content">
            <h2>System Overview</h2>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <h3>Total Users</h3>
                <p className="admin-stat-number">{stats.totalUsers || 0}</p>
              </div>
              <div className="admin-stat-card">
                <h3>Patients</h3>
                <p className="admin-stat-number">{stats.totalPatients || 0}</p>
              </div>
              <div className="admin-stat-card">
                <h3>Pharmacists</h3>
                <p className="admin-stat-number">{stats.totalPharmacists || 0}</p>
              </div>
              <div className="admin-stat-card">
                <h3>Total Pharmacies</h3>
                <p className="admin-stat-number">{stats.totalPharmacies || 0}</p>
              </div>
              <div className="admin-stat-card pending">
                <h3>Pending Approvals</h3>
                <p className="admin-stat-number">{stats.pendingPharmacies || 0}</p>
              </div>
              <div className="admin-stat-card approved">
                <h3>Approved Pharmacies</h3>
                <p className="admin-stat-number">{stats.approvedPharmacies || 0}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="admin-approvals-content">
            <h2>Pending Pharmacy Approvals</h2>
            {pendingPharmacies.length === 0 ? (
              <div className="admin-empty-state">
                <p>No pending pharmacy approvals</p>
              </div>
            ) : (
              <div className="admin-pharmacy-list">
                {pendingPharmacies.map(pharmacy => (
                  <div key={pharmacy._id} className="admin-pharmacy-card">
                    <div className="pharmacy-info">
                      <h3>{pharmacy.name}</h3>
                      <p><strong>License:</strong> {pharmacy.licenseNumber}</p>
                      <p><strong>Owner:</strong> {pharmacy.owner?.firstName} {pharmacy.owner?.lastName}</p>
                      <p><strong>Email:</strong> {pharmacy.owner?.email}</p>
                      <p><strong>Phone:</strong> {pharmacy.owner?.phone}</p>
                      <p><strong>Location:</strong> {pharmacy.address?.street}, {pharmacy.address?.city}</p>
                      {pharmacy.description && (
                        <p><strong>Description:</strong> {pharmacy.description}</p>
                      )}
                    </div>
                    <div className="pharmacy-actions">
                      <button 
                        onClick={() => handleApprovePharmacy(pharmacy._id)}
                        className="admin-approve-btn"
                      >
                        ✅ Approve
                      </button>
                      <button 
                        onClick={() => handleRejectPharmacy(pharmacy._id)}
                        className="admin-reject-btn"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;