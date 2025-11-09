import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const DrugSearch = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search for medications, symptoms, or conditions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              fontSize: '1.1rem'
            }}
          />
          <button 
            type="submit"
            className="btn btn-primary"
            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
          >
            🔍 Search
          </button>
        </div>
      </form>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        <div 
          className="feature-card"
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/search?category=pain-relief')}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💊</div>
          <h3>Pain Relief</h3>
          <p style={{ color: 'var(--text-light)' }}>Paracetamol, Ibuprofen, Aspirin</p>
        </div>

        <div 
          className="feature-card"
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/search?category=antibiotics')}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦠</div>
          <h3>Antibiotics</h3>
          <p style={{ color: 'var(--text-light)' }}>Amoxicillin, Azithromycin</p>
        </div>

        <div 
          className="feature-card"
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/search?category=vitamins')}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <h3>Vitamins & Supplements</h3>
          <p style={{ color: 'var(--text-light)' }}>Vitamin C, Multivitamins</p>
        </div>
      </div>
    </div>
  );
};

export default DrugSearch;