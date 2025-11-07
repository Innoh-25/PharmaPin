import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Pharmacist.css';

const InventoryDrugs = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const pharmacyResponse = await axios.get('http://localhost:5000/api/pharmacy-onboarding/profile');
      const pharmacyId = pharmacyResponse.data._id;
      
      const inventoryResponse = await axios.get(`http://localhost:5000/api/inventory/pharmacy/${pharmacyId}`);
      setInventory(inventoryResponse.data.inventory || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      alert('Error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.drug?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.drug?.genericName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.drug?.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item) => {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= item.minStockLevel) return 'low-stock';
    return 'in-stock';
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-drugs-container">
      <div className="inventory-header">
        <h1>Inventory Drugs</h1>
        <p>Manage your current stock and pricing</p>
      </div>

      {/* Filters */}
      <div className="inventory-filters">
        <input
          type="text"
          placeholder="Search drugs in inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="antibiotics">Antibiotics</option>
          <option value="analgesics">Analgesics</option>
          <option value="antipyretics">Antipyretics</option>
          <option value="antidepressants">Antidepressants</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Inventory Grid */}
      <div className="inventory-drugs-grid">
        {filteredInventory.length === 0 ? (
          <div className="empty-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No drugs found in inventory</p>
            <p className="empty-state-subtitle">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search criteria' 
                : 'Add drugs to your inventory to get started'
              }
            </p>
          </div>
        ) : (
          filteredInventory.map((item) => (
            <div key={item._id} className={`inventory-drug-card ${getStockStatus(item)}`}>
              <div className="drug-card-header">
                <h3>{item.drug?.name}</h3>
                {item.drug?.genericName && (
                  <p className="drug-generic">({item.drug.genericName})</p>
                )}
                <div className="drug-category">{item.drug?.category}</div>
              </div>

              <div className="inventory-details">
                <div className="stock-info">
                  <div className="quantity-display">
                    <span className="quantity-number">{item.quantity}</span>
                    <span className="quantity-label">in stock</span>
                  </div>
                  <div className="stock-status">
                    <span className={`status-dot ${getStockStatus(item)}`}></span>
                    {getStockStatus(item) === 'out-of-stock' && 'Out of Stock'}
                    {getStockStatus(item) === 'low-stock' && 'Low Stock'}
                    {getStockStatus(item) === 'in-stock' && 'In Stock'}
                  </div>
                </div>

                <div className="pricing-info">
                  <div className="price-main">
                    KSh {item.price?.toLocaleString()}
                  </div>
                  {item.discount > 0 && (
                    <div className="price-discount">
                      <span className="original-price">
                        KSh {(item.price / (1 - item.discount / 100)).toLocaleString()}
                      </span>
                      <span className="discount-badge">-{item.discount}%</span>
                    </div>
                  )}
                </div>

                <div className="inventory-meta">
                  <div className="meta-item">
                    <span className="meta-label">Expiry:</span>
                    <span className={`meta-value ${new Date(item.expiryDate) < new Date() ? 'expired' : ''}`}>
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {item.batchNumber && (
                    <div className="meta-item">
                      <span className="meta-label">Batch:</span>
                      <span className="meta-value">{item.batchNumber}</span>
                    </div>
                  )}

                  <div className="meta-item">
                    <span className="meta-label">Stock Levels:</span>
                    <span className="meta-value">
                      Min: {item.minStockLevel} | Max: {item.maxStockLevel}
                    </span>
                  </div>

                  {item.supplier && (
                    <div className="meta-item">
                      <span className="meta-label">Supplier:</span>
                      <span className="meta-value">{item.supplier}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="inventory-actions">
                <button className="btn btn-primary btn-sm">
                  Update Stock
                </button>
                <button className="btn btn-secondary btn-sm">
                  Edit Price
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryDrugs;