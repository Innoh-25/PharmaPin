import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Pharmacist.css';

const PendingApproval = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="pending-approval-container">
      <div className="pending-approval-card">
        <div className="pending-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1>Approval Pending</h1>
        
        <p>
          Your pharmacy profile has been submitted and is currently under review by our admin team. 
          You'll be notified once your account is approved.
        </p>
        
        <div className="pending-actions">
          <button
            onClick={handleLogout}
            className="btn btn-primary"
          >
            Logout
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;