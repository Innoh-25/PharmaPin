import React from 'react';
import SearchResultCard from './SearchResultCard';
import LoadingSpinner from '../../Shared/UI/LoadingSpinner';

const SearchResults = ({ results, loading, error, searchTerm }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="search-error">
        <p>Error searching for medications: {error}</p>
      </div>
    );
  }

  if (!searchTerm) {
    return (
      <div className="search-placeholder">
        <h3>Search for medications to get started</h3>
        <p>Enter drug name, symptoms, or browse categories</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="no-results">
        <h3>No medications found for "{searchTerm}"</h3>
        <p>Try adjusting your search terms or filters</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h2>Search Results for "{searchTerm}"</h2>
        <span className="results-count">{results.length} medications found</span>
      </div>

      <div className="results-grid">
        {results.map((drug) => (
          <SearchResultCard key={drug._id} drug={drug} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;