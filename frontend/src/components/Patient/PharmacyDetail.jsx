import React from 'react';
import { useParams } from 'react-router-dom';

const PharmacyDetail = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Pharmacy Details</h1>
      <div className="feature-card">
        <p>Pharmacy {id} details coming soon...</p>
      </div>
    </div>
  );
};

export default PharmacyDetail;