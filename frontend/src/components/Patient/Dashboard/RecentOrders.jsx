import React from 'react';
import { Link } from 'react-router-dom';

const RecentOrders = () => {
  // Mock data - replace with actual API call
  const recentOrders = [
    { id: 1, drug: 'Paracetamol', status: 'Delivered', date: '2024-01-15', pharmacy: 'City Pharmacy' },
    { id: 2, drug: 'Amoxicillin', status: 'In Progress', date: '2024-01-14', pharmacy: 'MediQuick' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'var(--success-color)';
      case 'In Progress': return 'var(--primary-color)';
      default: return 'var(--text-light)';
    }
  };

  return (
    <div>
      {recentOrders.length === 0 ? (
        <div className="feature-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--text-light)' }}>No recent orders</p>
          <Link to="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        recentOrders.map(order => (
          <div key={order.id} className="feature-card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0 }}>{order.drug}</h4>
              <span style={{ 
                color: getStatusColor(order.status),
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}>
                {order.status}
              </span>
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              {order.pharmacy} • {new Date(order.date).toLocaleDateString()}
            </p>
            <Link 
              to={`/patient/orders/${order.id}`}
              className="nav-link"
              style={{ fontSize: '0.8rem' }}
            >
              View Details
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentOrders;