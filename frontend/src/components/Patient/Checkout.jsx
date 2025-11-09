import React from 'react';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const { drug, pharmacy, quantity } = location.state || {};

  if (!drug || !pharmacy) {
    return (
      <div>
        <h1>Checkout</h1>
        <div className="feature-card">
          <p>No order information available. Please start from search.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      <div className="feature-card">
        <h2>Order Summary</h2>
        <p><strong>Drug:</strong> {drug.name}</p>
        <p><strong>Pharmacy:</strong> {pharmacy.name}</p>
        <p><strong>Price:</strong> KSh {pharmacy.price}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Total:</strong> KSh {pharmacy.price * quantity}</p>
        
        <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;