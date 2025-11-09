import React from 'react';
import { Link } from 'react-router-dom';

const NearbyPharmacies = ({ userLocation }) => {
  // Mock data - replace with actual API call
  const nearbyPharmacies = [
    { id: 1, name: 'City Pharmacy', distance: '0.5 km', rating: 4.5, open: true },
    { id: 2, name: 'MediQuick', distance: '1.2 km', rating: 4.2, open: true },
    { id: 3, name: 'HealthPlus', distance: '2.1 km', rating: 4.7, open: false }
  ];

  return (
    <div>
      {nearbyPharmacies.map(pharmacy => (
        <div key={pharmacy.id} className="feature-card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>{pharmacy.name}</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                {pharmacy.distance} away • ⭐ {pharmacy.rating}
              </p>
              <span style={{
                color: pharmacy.open ? 'var(--success-color)' : 'var(--accent-color)',
                fontWeight: 'bold'
              }}>
                {pharmacy.open ? 'Open Now' : 'Closed'}
              </span>
            </div>
            <Link 
              to={`/pharmacy/${pharmacy.id}`}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem' }}
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NearbyPharmacies;