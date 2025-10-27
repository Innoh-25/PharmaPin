import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'patient'
  });

  const { name, email, phone, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Sending registration request to:', 'http://localhost:5000/api/auth/register');
      
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      console.log('SUCCESS:', response.data);
      alert('Registration successful!');
      
    } catch (error) {
      console.log('ERROR DETAILS:');
      console.log('- Error message:', error.message);
      console.log('- Response status:', error.response?.status);
      console.log('- Response data:', error.response?.data);
      console.log('- Request URL:', error.config?.url);
      
      alert('Registration failed. Check console for details.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your Account</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <select name="role" value={role} onChange={onChange}>
              <option value="patient">Patient</option>
              <option value="pharmacist">Pharmacist</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;