import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Order Details #{id}</h1>
      <div className="feature-card">
        <p>Order details coming soon...</p>
      </div>
    </div>
  );
};

export default OrderDetails;