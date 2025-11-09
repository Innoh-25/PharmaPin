import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../../Shared/UI/LoadingSpinner';

const DrugSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    distance: 10,
    inStock: true,
    priceRange: [0, 10000]
  });

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    }
  }, [searchTerm, filters]);

  const performSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userLocation = JSON.parse(localStorage.getItem('userLocation')) || {
        latitude: -1.2921,
        longitude: 36.8219
      };

      // Try API call first, fallback to mock data if it fails
      try {
        const response = await axios.post('http://localhost:5000/api/patients/search', {
          searchTerm: searchTerm.trim(),
          filters,
          userLocation
        });

        if (response.data.success) {
          setResults(response.data.data);
        } else {
          setError('Search failed. Please try again.');
          setResults(getMockResults());
        }
      } catch (apiError) {
        console.warn('API call failed, using mock data');
        setResults(getMockResults());
      }

    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search for medications. Using demo data.');
      setResults(getMockResults());
    } finally {
      setLoading(false);
    }
  };

  const getMockResults = () => [
    {
      drug: {
        _id: '1',
        name: 'Paracetamol 500mg',
        description: 'Pain reliever and fever reducer',
        category: 'Pain Relief',
        manufacturer: 'Pharma Ltd',
        prescriptionRequired: false
      },
      pharmacy: {
        _id: '1',
        businessName: 'City Pharmacy',
        address: '123 Main Street, Nairobi',
        phone: '+254700111222',
        email: 'city@pharmacy.com',
        operatingHours: 'Mon-Sun: 8:00 AM - 10:00 PM',
        rating: 4.5
      },
      price: 50,
      distance: '0.8',
      inStock: true,
      quantity: 100
    },
    {
      drug: {
        _id: '2',
        name: 'Amoxicillin 250mg',
        description: 'Antibiotic for bacterial infections',
        category: 'Antibiotics',
        manufacturer: 'MediCorp',
        prescriptionRequired: true
      },
      pharmacy: {
        _id: '2',
        businessName: 'MediQuick Pharmacy',
        address: '456 Westlands, Nairobi',
        phone: '+254700333444',
        email: 'info@mediquick.com',
        operatingHours: '24/7',
        rating: 4.2
      },
      price: 120,
      distance: '1.2',
      inStock: true,
      quantity: 50
    },
    {
      drug: {
        _id: '3',
        name: 'Vitamin C 1000mg',
        description: 'Immune system support and antioxidant',
        category: 'Vitamins',
        manufacturer: 'HealthPlus',
        prescriptionRequired: false
      },
      pharmacy: {
        _id: '3',
        businessName: 'Wellness Pharmacy',
        address: '789 Thika Road, Nairobi',
        phone: '+254700555666',
        email: 'wellness@pharmacy.com',
        operatingHours: 'Mon-Fri: 7:00 AM - 9:00 PM',
        rating: 4.7
      },
      price: 25,
      distance: '2.5',
      inStock: true,
      quantity: 200
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/patient/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleOrder = (result) => {
    if (!user) {
      navigate('/login', { 
        state: { 
          returnTo: '/patient/checkout',
          message: 'Please login to place an order' 
        } 
      });
      return;
    }
    navigate('/patient/checkout', { state: { orderData: result } });
  };

  const handleViewDetails = (result) => {
    navigate('/patient/drug-details', { state: { result } });
  };

  return (
    <div className="search-container">
      {/* Search Header */}
      <div className="search-header">
        <h1>Find Medications</h1>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search for drugs, symptoms, or conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary search-btn">
              🔍 Search
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="search-filters">
        <div className="filter-group">
          <label>Max Distance:</label>
          <select 
            value={filters.distance} 
            onChange={(e) => setFilters(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input 
              type="checkbox" 
              checked={filters.inStock}
              onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
            />
            In Stock Only
          </label>
        </div>

        <div className="filter-group">
          <label>Price Range:</label>
          <select 
            value={filters.priceRange[1]} 
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
          >
            <option value={10000}>Any Price</option>
            <option value={100}>Under KSh 100</option>
            <option value={500}>Under KSh 500</option>
            <option value={1000}>Under KSh 1,000</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="search-results">
        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && searchTerm && (
          <div className="results-header">
            <h2>Search Results for "{searchTerm}"</h2>
            <span className="results-count">{results.length} results found</span>
          </div>
        )}

        <div className="results-grid">
          {results.map((result, index) => (
            <div key={index} className="search-result-card">
              <div className="drug-info">
                <h3>{result.drug.name}</h3>
                <p className="drug-description">{result.drug.description}</p>
                <div className="drug-meta">
                  <span className="drug-category">{result.drug.category}</span>
                  {result.drug.prescriptionRequired && (
                    <span className="prescription-badge">Prescription Required</span>
                  )}
                </div>
              </div>

              <div className="pharmacy-info">
                <h4>{result.pharmacy.businessName}</h4>
                <p className="pharmacy-address">📍 {result.pharmacy.address}</p>
                <p className="pharmacy-distance">🚗 {result.distance} km away</p>
                <p className="pharmacy-hours">🕒 {result.pharmacy.operatingHours}</p>
                <div className="pharmacy-rating">⭐ {result.pharmacy.rating}</div>
              </div>

              <div className="pricing-info">
                <div className="price">KSh {result.price}</div>
                <div className={`stock-status ${result.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {result.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  onClick={() => handleViewDetails(result)}
                  className="btn btn-secondary"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleOrder(result)}
                  className="btn btn-primary"
                  disabled={!result.inStock}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && searchTerm && results.length === 0 && (
          <div className="no-results">
            <h3>No medications found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}

        {!searchTerm && (
          <div className="search-suggestions">
            <h3>Popular Searches</h3>
            <div className="suggestion-chips">
              {['Paracetamol', 'Amoxicillin', 'Vitamins', 'Painkillers', 'Antibiotics'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchTerm(suggestion)}
                  className="suggestion-chip"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugSearch;