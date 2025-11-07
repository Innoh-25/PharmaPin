import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/Pharmacist.css';

const ManageInventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // First get pharmacy ID
      const pharmacyResponse = await axios.get('http://localhost:5000/api/pharmacy-onboarding/profile');
      const pharmacyId = pharmacyResponse.data._id;
      
      // Then get inventory
      const inventoryResponse = await axios.get(`http://localhost:5000/api/inventory/pharmacy/${pharmacyId}`);
      setInventory(inventoryResponse.data.inventory || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      alert('Error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInventory = async (itemId, updates) => {
    try {
      await axios.put(`http://localhost:5000/api/inventory/${itemId}`, updates);
      alert('Inventory updated successfully!');
      setEditingItem(null);
      fetchInventory(); // Refresh data
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Error updating inventory');
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.drug?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.drug?.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Manage Inventory</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search drugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="inventory-content">
        {filteredInventory.length === 0 ? (
          <div className="empty-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No inventory items found</p>
            <p className="empty-state-subtitle">
              {searchTerm ? 'Try adjusting your search' : 'Add your first drug to get started'}
            </p>
          </div>
        ) : (
          <div className="inventory-grid">
            {filteredInventory.map((item) => (
              <div key={item._id} className="inventory-card">
                <div className="inventory-card-header">
                  <h3>{item.drug?.name}</h3>
                  {item.drug?.genericName && (
                    <p className="drug-generic">({item.drug.genericName})</p>
                  )}
                </div>

                <div className="inventory-details">
                  <div className="detail-row">
                    <span>Quantity:</span>
                    <span className={`quantity ${item.quantity <= item.minStockLevel ? 'low-stock' : ''}`}>
                      {item.quantity} {item.quantity <= item.minStockLevel && '⚠️'}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span>Price:</span>
                    <span>KSh {item.price?.toLocaleString()}</span>
                  </div>

                  {item.discount > 0 && (
                    <div className="detail-row">
                      <span>Discount:</span>
                      <span className="discount">{item.discount}%</span>
                    </div>
                  )}

                  <div className="detail-row">
                    <span>Expiry:</span>
                    <span className={new Date(item.expiryDate) < new Date() ? 'expired' : ''}>
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span>Status:</span>
                    <span className={`status ${item.isAvailable ? 'available' : 'unavailable'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="inventory-actions">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </button>
                </div>

                {/* Edit Modal */}
                {editingItem?._id === item._id && (
                  <EditInventoryModal
                    item={item}
                    onSave={handleUpdateInventory}
                    onClose={() => setEditingItem(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Edit Inventory Modal Component
const EditInventoryModal = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    quantity: item.quantity,
    price: item.price,
    discount: item.discount,
    expiryDate: item.expiryDate.split('T')[0],
    isAvailable: item.isAvailable,
    minStockLevel: item.minStockLevel,
    maxStockLevel: item.maxStockLevel
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(item._id, formData);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Inventory - {item.drug?.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Price (KSh) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Min Stock Level</label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Max Stock Level</label>
              <input
                type="number"
                name="maxStockLevel"
                value={formData.maxStockLevel}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
              />
              <span>Available for sale</span>
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Updating...' : 'Update Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageInventory;