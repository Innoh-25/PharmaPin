import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const DrugDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { result } = location.state || {};
  const [quantity, setQuantity] = useState(1);

  if (!result) {
    return (
      <div className="drug-details-container">
        <div className="error-state">
          <h2>No drug information available</h2>
          <p>Please go back and select a medication</p>
          <button onClick={() => navigate('/patient/search')} className="btn btn-primary">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const { drug, pharmacy, price, distance, inStock } = result;

  const handleGetDirections = () => {
    const dest = typeof pharmacy.address === 'string'
      ? pharmacy.address
      : pharmacy.address?.address
        ? `${pharmacy.address.address}${pharmacy.address.city ? ', ' + pharmacy.address.city : ''}`
        : '';
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleOrderNow = () => {
    if (!user) {
      navigate('/login', { 
        state: { 
          returnTo: '/patient/checkout',
          orderData: { ...result, quantity }
        } 
      });
      return;
    }
    navigate('/patient/checkout', { state: { orderData: { ...result, quantity } } });
  };

  const totalPrice = price * quantity;

  return (
    <div className="drug-details-container">
      <div className="drug-details-card">
        {/* Drug Header */}
        <div className="drug-header">
          <div>
            <h1>{drug.name}</h1>
            <p className="drug-category">{drug.category} • {drug.manufacturer}</p>
          </div>
          <div className={`availability-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>

        {/* Drug Information */}
        <div className="drug-info-section">
          <h2>Description</h2>
          <p>{drug.description}</p>
          
          {drug.prescriptionRequired && (
            <div className="prescription-warning">
              <strong>⚠️ Prescription Required</strong>
              <p>You'll need a valid prescription from a doctor to purchase this medication.</p>
            </div>
          )}
        </div>

        {/* Pharmacy Information */}
        <div className="pharmacy-section">
          <h2>Available at this Pharmacy</h2>
          <div className="pharmacy-card">
            <h3>{pharmacy.name || pharmacy.businessName || 'Pharmacy'}</h3>
            <div className="pharmacy-details">
              <p>📍 {
                typeof pharmacy.address === 'string'
                  ? pharmacy.address
                  : pharmacy.address?.address
                    ? `${pharmacy.address.address}${pharmacy.address.city ? ', ' + pharmacy.address.city : ''}`
                    : 'Address not provided'
              }</p>
              <p>📞 {pharmacy.phone || pharmacy.contact?.phone || 'N/A'}</p>
              <p>📧 {pharmacy.email || pharmacy.contact?.email || 'N/A'}</p>
              <p>🕒 {
                typeof pharmacy.operatingHours === 'string'
                  ? pharmacy.operatingHours
                  : pharmacy.operatingHours
                    ? `${pharmacy.operatingHours.open || ''}${pharmacy.operatingHours.open && pharmacy.operatingHours.closing ? ' - ' : ''}${pharmacy.operatingHours.closing || ''}`
                    : 'Hours not available'
              }</p>
              <p>🚗 {distance} km away</p>
              <div className="pharmacy-rating">⭐ {pharmacy.rating ?? 'N/A'} Rating</div>
            </div>
          </div>
        </div>

        {/* Order Section */}
        <div className="order-section">
          <h2>Order Details</h2>
          <div className="pricing-info">
            <div className="unit-price">Unit Price: <strong>KSh {price}</strong></div>
            
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="total-price">
              Total: <strong>KSh {totalPrice}</strong>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleGetDirections}
              className="btn btn-secondary"
              disabled={!pharmacy.address}
            >
              🗺️ Get Directions
            </button>
            
            <button 
              onClick={handleOrderNow}
              className="btn btn-primary"
              disabled={!inStock}
            >
              🛒 Order Now
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="additional-info">
          <h3>Delivery Information</h3>
          <p>📦 {distance < 5 ? 'Same day delivery available' : 'Delivery within 24 hours'}</p>
          <p>💰 Delivery fee: KSh {distance < 5 ? '100' : '200'}</p>
          
          <h3>Pickup Information</h3>
          <p>🏪 Ready for pickup in 30 minutes</p>
          <p>🆔 Bring your ID for prescription medications</p>
        </div>
      </div>
    </div>
  );
};

export default DrugDetails;