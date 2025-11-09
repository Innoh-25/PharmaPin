import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchResultCard from './SearchResultCard';
import LoadingSpinner from '../../Shared/UI/LoadingSpinner';
import axios from 'axios';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    distance: 10,
    priceRange: [0, 10000],
    inStock: true
  });

  const query = searchParams.get('q');
  const category = searchParams.get('category');

  useEffect(() => {
    if (query || category) {
      performSearch();
    }
  }, [query, category, filters]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const searchData = {
        searchTerm: query,
        category: category,
        filters: filters,
        userLocation: JSON.parse(localStorage.getItem('userLocation')) // Get saved location
      };

      const response = await axios.post('http://localhost:5000/api/patients/search', searchData);
      setResults(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return (
      <div className="search-results-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>
          {query ? `Search Results for "${query}"` : category ? `${category.replace('-', ' ').toUpperCase()}` : 'All Medications'}
        </h1>
        <p className="results-count">{results.length} medications found</p>
      </div>

      {/* Search Filters */}
      <div className="search-filters">
        <div className="filter-group">
          <label>Distance:</label>
          <select 
            value={filters.distance} 
            onChange={(e) => updateFilters({ distance: parseInt(e.target.value) })}
          >
            <option value={5}>Within 5km</option>
            <option value={10}>Within 10km</option>
            <option value={25}>Within 25km</option>
            <option value={50}>Within 50km</option>
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input 
              type="checkbox" 
              checked={filters.inStock}
              onChange={(e) => updateFilters({ inStock: e.target.checked })}
            />
            In Stock Only
          </label>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="results-grid">
        {results.map((result) => (
          <SearchResultCard 
            key={`${result.drug._id}-${result.pharmacy._id}`} 
            result={result} 
            onSelect={() => navigate(`/patient/drug-details`, { state: { result } })}
          />
        ))}
      </div>

      {results.length === 0 && !loading && (
        <div className="no-results">
          <h3>No medications found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;