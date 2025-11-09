import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchResultCard from '../../components/Patient/Search/SearchResultCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const category = searchParams.get('category');

  // Mock data - replace with actual API call
  const searchResults = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      description: 'Pain reliever and fever reducer',
      inStock: true,
      prescriptionRequired: false,
      pharmacies: [
        { id: 1, name: 'City Pharmacy', distance: '0.5 km', price: 50, rating: 4.5, inStock: true },
        { id: 2, name: 'MediQuick', distance: '1.2 km', price: 45, rating: 4.2, inStock: true }
      ]
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      description: 'Antibiotic for bacterial infections',
      inStock: true,
      prescriptionRequired: true,
      pharmacies: [
        { id: 1, name: 'City Pharmacy', distance: '0.5 km', price: 120, rating: 4.5, inStock: true }
      ]
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>
          {query ? `Search Results for "${query}"` : category ? `${category.replace('-', ' ')}` : 'All Medications'}
        </h1>
        <p style={{ color: 'var(--text-light)' }}>
          {searchResults.length} medications found
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {searchResults.map(drug => (
          <SearchResultCard key={drug.id} drug={drug} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;