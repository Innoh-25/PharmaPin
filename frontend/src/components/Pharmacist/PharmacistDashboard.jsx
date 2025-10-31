import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/Pharmacist.css';

const PharmacistDashboard = () => {
  const { user, logout } = useAuth();
  const [pharmacy, setPharmacy] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const pharmacyResponse = await axios.get('http://localhost:5000/api/pharmacy-onboarding/profile');
      setPharmacy(pharmacyResponse.data);

      const ordersResponse = await axios.get('http://localhost:5000/api/orders/pharmacy-orders?limit=5');
      setRecentOrders(ordersResponse.data.orders || []);

      const inventoryResponse = await axios.get(`http://localhost:5000/api/inventory/pharmacy/${pharmacyResponse.data._id}?inStock=true`);
      const lowStockItems = inventoryResponse.data.inventory.filter(item => item.quantity <= item.minStockLevel).length;

      setStats({
        totalOrders: ordersResponse.data.total || 0,
        pendingOrders: ordersResponse.data.orders?.filter(order => order.status === 'pending').length || 0,
        lowStockItems,
        totalRevenue: 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="dashboard-title">PharmaPin Dashboard</div>
          <div className="user-menu">
            <span className="user-greeting">Welcome, {user?.firstName}</span>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-main">
        {/* Pharmacy Info Banner */}
        {pharmacy && (
          <div className="pharmacy-banner">
            <div className="banner-content">
              <div className="pharmacy-info">
                <h2>{pharmacy.name}</h2>
                <p className="pharmacy-address">{pharmacy.fullAddress}</p>
                <div className="pharmacy-meta">
                  <span>📞 {pharmacy.phone}</span>
                  <span>🕒 {pharmacy.operatingHours.opening} - {pharmacy.operatingHours.closing}</span>
                  <span className="status-badge">✅ Approved</span>
                </div>
              </div>
              <button className="edit-profile-btn">
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon blue">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-text">
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon yellow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-text">
                <p className="stat-label">Pending Orders</p>
                <p className="stat-value">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon red">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="stat-text">
                <p className="stat-label">Low Stock Items</p>
                <p className="stat-value">{stats.lowStockItems}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon green">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6v0m0 0v0" />
                </svg>
              </div>
              <div className="stat-text">
                <p className="stat-label">Total Revenue</p>
                <p className="stat-value">KSh {stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Orders */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Recent Orders</h3>
            </div>
            <div className="section-content">
              {recentOrders.length > 0 ? (
                <div className="orders-list">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="order-item">
                      <div className="order-info">
                        <h4>Order #{order.orderNumber}</h4>
                        <p className="order-meta">
                          {order.items?.length} items • {order.patient?.firstName} {order.patient?.lastName}
                        </p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${
                          order.status === 'pending' ? 'status-pending' :
                          order.status === 'confirmed' ? 'status-confirmed' :
                          order.status === 'ready_for_pickup' ? 'status-ready' :
                          'status-default'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        <p className="order-amount">
                          KSh {order.finalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>No orders yet</p>
                </div>
              )}
              <div className="view-all-btn">
                <button className="view-all-link">
                  View All Orders →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="section-content">
              <div className="quick-actions-grid">
                <button className="action-card">
                  <div className="action-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="action-label">Add Drug</p>
                </button>

                <button className="action-card">
                  <div className="action-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="action-label">Manage Inventory</p>
                </button>

                <button className="action-card">
                  <div className="action-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="action-label">View Orders</p>
                </button>

                <button className="action-card">
                  <div className="action-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="action-label">Reports</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;