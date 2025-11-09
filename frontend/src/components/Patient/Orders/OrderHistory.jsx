import React from 'react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  return (
    <div>
      <h1>Order History</h1>
      <div className="feature-card">
        <p>Order history coming soon...</p>
        <Link to="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderHistory;