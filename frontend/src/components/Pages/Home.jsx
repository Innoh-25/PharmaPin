import React from 'react';

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <h1>Welcome to PharmaPin</h1>
        <p>Your trusted platform for connecting with pharmacies and accessing medications.</p>
        <div className="features">
          <div className="feature-card">
            <h3>Find Medications</h3>
            <p>Search for drugs across multiple pharmacies</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Availability</h3>
            <p>Check stock levels in real-time</p>
          </div>
          <div className="feature-card">
            <h3>Easy Ordering</h3>
            <p>Pickup or delivery options available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;