import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Pharmacist.css';

const DrugClassManager = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('antibiotics');
  const [showAddDrugModal, setShowAddDrugModal] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'antibiotics', 'analgesics', 'antipyretics', 'antidepressants',
    'antihypertensives', 'diabetes', 'cardiology', 'respiratory',
    'gastrointestinal', 'dermatology', 'vitamins', 'supplements',
    'first-aid', 'contraceptives', 'other'
  ];

  useEffect(() => {
    fetchDrugsByCategory(selectedCategory);
  }, [selectedCategory]);

  const fetchDrugsByCategory = async (category) => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/drugs/pharmacy-drugs?category=${category}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrugs(response.data.drugs || []);
    } catch (error) {
      console.error('Error fetching drugs:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load drugs';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDisplayName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleDrugAdded = () => {
    fetchDrugsByCategory(selectedCategory);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Loading drugs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drug-class-container">
      <div className="drug-class-header">
        <h1>Manage Drug Database</h1>
        <p>Organize your drugs by category</p>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {getCategoryDisplayName(category)}
            <span className="drug-count">
              ({drugs.filter(drug => drug.category === category).length})
            </span>
          </button>
        ))}
      </div>

      {/* Category Content */}
      <div className="category-content">
        <div className="category-header">
          <h2>{getCategoryDisplayName(selectedCategory)}</h2>
          <button
            onClick={() => setShowAddDrugModal(true)}
            className="btn btn-primary"
          >
            Add New Drug
          </button>
        </div>

        {drugs.length === 0 ? (
          <div className="empty-category">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={200} height={200}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>No drugs in {getCategoryDisplayName(selectedCategory)} category</p>
            <p className="empty-state-subtitle">
              Add your first drug to this category to get started
            </p>
            <button
              onClick={() => setShowAddDrugModal(true)}
              className="btn btn-primary"
            >
              Add First Drug
            </button>
          </div>
        ) : (
          <div className="drugs-list">
            {drugs.map(drug => (
              <div key={drug._id} className="drug-item">
                <div className="drug-info">
                  <h3>{drug.name}</h3>
                  {drug.genericName && (
                    <p className="drug-generic">({drug.genericName})</p>
                  )}
                  <div className="drug-meta">
                    <span className="drug-form">{drug.form}</span>
                    {drug.strength?.value && (
                      <span className="drug-strength">
                        {drug.strength.value} {drug.strength.unit}
                      </span>
                    )}
                    <span className={`prescription-badge ${drug.prescriptionRequired ? 'required' : 'not-required'}`}>
                      {drug.prescriptionRequired ? 'Rx Required' : 'OTC'}
                    </span>
                  </div>
                  {drug.manufacturer && (
                    <p className="drug-manufacturer">By: {drug.manufacturer}</p>
                  )}
                </div>
                <div className="drug-actions">
                  <button className="btn btn-secondary btn-sm">
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Drug Modal */}
      <AddDrugModal
        isOpen={showAddDrugModal}
        onClose={() => setShowAddDrugModal(false)}
        onDrugAdded={handleDrugAdded}
        initialCategory={selectedCategory}
      />
    </div>
  );
};

// Add Drug Modal Component
const AddDrugModal = ({ isOpen, onClose, onDrugAdded, initialCategory }) => {
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brand: '',
    description: '',
    category: initialCategory,
    form: 'tablet',
    strength: {
      value: '',
      unit: ''
    },
    prescriptionRequired: false,
    manufacturer: '',
    barcode: '',
    dosageInstructions: '',
    sideEffects: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'antibiotics', 'analgesics', 'antipyretics', 'antidepressants',
    'antihypertensives', 'diabetes', 'cardiology', 'respiratory',
    'gastrointestinal', 'dermatology', 'vitamins', 'supplements',
    'first-aid', 'contraceptives', 'other'
  ];

  const forms = [
    'tablet', 'capsule', 'syrup', 'injection', 'ointment', 
    'cream', 'drops', 'inhaler', 'other'
  ];

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, category: initialCategory }));
      setError('');
    }
  }, [isOpen, initialCategory]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStrengthChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      strength: {
        ...prev.strength,
        [field]: field === 'value' ? parseFloat(value) || '' : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Prepare data for submission
      const submissionData = {
        ...formData,
        strength: formData.strength.value ? formData.strength : undefined
      };

      // Remove empty fields
      Object.keys(submissionData).forEach(key => {
        if (submissionData[key] === '' || submissionData[key] === null || submissionData[key] === undefined) {
          delete submissionData[key];
        }
      });

      await axios.post('http://localhost:5000/api/drugs', submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Drug added successfully!');
      onDrugAdded();
      onClose();
      // Reset form
      setFormData({
        name: '',
        genericName: '',
        brand: '',
        description: '',
        category: initialCategory,
        form: 'tablet',
        strength: { value: '', unit: '' },
        prescriptionRequired: false,
        manufacturer: '',
        barcode: '',
        dosageInstructions: '',
        sideEffects: []
      });
    } catch (error) {
      console.error('Error adding drug:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add drug';
      const errorDetails = error.response?.data?.details;
      setError(errorMessage);
      alert(`Error: ${errorMessage}${errorDetails ? `\nDetails: ${JSON.stringify(errorDetails)}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <div className="modal-header">
          <h2>Add Drug to {formData.category.charAt(0).toUpperCase() + formData.category.slice(1)}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Drug Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Amoxicillin"
              />
            </div>

            <div className="form-group">
              <label>Generic Name</label>
              <input
                type="text"
                name="genericName"
                value={formData.genericName}
                onChange={handleInputChange}
                placeholder="e.g., Amoxicillin Trihydrate"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Form *</label>
              <select
                name="form"
                value={formData.form}
                onChange={handleInputChange}
                required
              >
                {forms.map(form => (
                  <option key={form} value={form}>
                    {form.charAt(0).toUpperCase() + form.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., Amoxil"
              />
            </div>

            <div className="form-group">
              <label>Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                placeholder="e.g., GlaxoSmithKline"
              />
            </div>

            <div className="form-group">
              <label>Strength Value</label>
              <input
                type="number"
                value={formData.strength.value}
                onChange={(e) => handleStrengthChange('value', e.target.value)}
                placeholder="e.g., 500"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label>Strength Unit</label>
              <input
                type="text"
                value={formData.strength.unit}
                onChange={(e) => handleStrengthChange('unit', e.target.value)}
                placeholder="e.g., mg"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Brief description of the drug..."
              maxLength="500"
            />
          </div>

          <div className="form-group">
            <label>Dosage Instructions</label>
            <input
              type="text"
              name="dosageInstructions"
              value={formData.dosageInstructions}
              onChange={handleInputChange}
              placeholder="e.g., Take 1 capsule every 8 hours"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="prescriptionRequired"
                checked={formData.prescriptionRequired}
                onChange={handleInputChange}
              />
              <span>Prescription Required</span>
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
              {loading ? 'Adding...' : 'Add Drug'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DrugClassManager;