import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuickSearch from './QuickSearch';
import RecentOrders from './RecentOrders';
import NearbyPharmacies from './NearbyPharmacies';

const PatientDashboard = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Simple geolocation - in real app, use the hook
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, []);

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Find Your Medications
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
          Search for drugs, compare prices, and get them delivered to your doorstep
        </p>
      </div>

      <QuickSearch />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        marginTop: '3rem'
      }}>
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2>Nearby Pharmacies</h2>
            <Link to="/search?filter=pharmacies" className="nav-link">View All</Link>
          </div>
          <NearbyPharmacies userLocation={userLocation} />
        </div>

        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2>Recent Orders</h2>
            <Link to="/patient/orders" className="nav-link">View All</Link>
          </div>
          <RecentOrders />
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Quick Actions</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Link to="/search?category=painkillers" className="feature-card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💊</div>
            <h3>Pain Relief</h3>
          </Link>
          <Link to="/search?category=antibiotics" className="feature-card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🦠</div>
            <h3>Antibiotics</h3>
          </Link>
          <Link to="/search?category=vitamins" className="feature-card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
            <h3>Vitamins</h3>
          </Link>
          <Link to="/search" className="feature-card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            <h3>All Medications</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;