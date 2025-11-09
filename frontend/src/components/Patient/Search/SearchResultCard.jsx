import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResultCard = ({ drug }) => {
  const navigate = useNavigate();

  const handleOrder = (pharmacy, drug) => {
    navigate('/patient/checkout', { 
      state: { 
        drug, 
        pharmacy,
        quantity: 1
      } 
    });
  };

  return (
    <div className="feature-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>{drug.name}</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>{drug.description}</p>
          {drug.prescriptionRequired && (
            <span style={{
              background: 'var(--accent-color)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              Prescription Required
            </span>
          )}
        </div>
        <span style={{
          color: drug.inStock ? 'var(--success-color)' : 'var(--accent-color)',
          fontWeight: 'bold'
        }}>
          {drug.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div>
        <h4 style={{ marginBottom: '1rem' }}>Available at:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {drug.pharmacies?.map((pharmacy) => (
            <div key={pharmacy.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{pharmacy.name}</div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  {pharmacy.distance} • ⭐ {pharmacy.rating} • KSh {pharmacy.price}
                </div>
              </div>
              <button 
                onClick={() => handleOrder(pharmacy, drug)}
                className="btn btn-primary"
                disabled={!pharmacy.inStock}
                style={{ padding: '0.5rem 1rem' }}
              >
                {pharmacy.inStock ? 'Order Now' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;