import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Pharmacist.css';

const AddDrugModal = ({ isOpen, onClose, onDrugAdded }) => {
  const [formData, setFormData] = useState({
    drug: '',
    quantity: '',
    price: '',
    discount: 0,
    expiryDate: '',
    batchNumber: '',
    supplier: '',
    minStockLevel: 10,
    maxStockLevel: 100
  });
  const [availableDrugs, setAvailableDrugs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableDrugs();
    }
  }, [isOpen]);

  const fetchAvailableDrugs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/drugs/not-in-inventory');
      setAvailableDrugs(response.data.drugs || []);
    } catch (error) {
      console.error('Error fetching available drugs:', error);
      alert('Error loading available drugs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/inventory', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Drug added to inventory successfully!');
      onDrugAdded();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding drug:', error);
      alert(error.response?.data?.message || 'Error adding drug to inventory');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      drug: '',
      quantity: '',
      price: '',
      discount: 0,
      expiryDate: '',
      batchNumber: '',
      supplier: '',
      minStockLevel: 10,
      maxStockLevel: 100
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Drug to Inventory</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Select Drug *</label>
            {loading ? (
              <div className="loading-text">Loading available drugs...</div>
            ) : availableDrugs.length === 0 ? (
              <div className="no-drugs-message">
                <p>No drugs available to add to inventory.</p>
                <p className="message-subtitle">
                  All drugs in your database are already in inventory, or you haven't added any drugs yet.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    // You can navigate to drug management here
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Manage Drugs
                </button>
              </div>
            ) : (
              <select
                name="drug"
                value={formData.drug}
                onChange={handleInputChange}
                required
                className="drug-select"
              >
                <option value="">Choose a drug...</option>
                {availableDrugs.map(drug => (
                  <option key={drug._id} value={drug._id}>
                    {drug.name} {drug.genericName && `(${drug.genericName})`} - {drug.form} {drug.strength.value && `${drug.strength.value}${drug.strength.unit}`}
                  </option>
                ))}
              </select>
            )}
          </div>

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
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Batch Number</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleInputChange}
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label>Supplier</label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                placeholder="Optional"
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
              disabled={loading || !formData.drug || availableDrugs.length === 0}
              className="btn btn-primary"
            >
              {loading ? 'Adding...' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDrugModal;