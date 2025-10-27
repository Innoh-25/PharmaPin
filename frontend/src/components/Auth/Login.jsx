import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Sending login request to:', 'http://localhost:5000/api/auth/login');
      
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      console.log('LOGIN SUCCESS:', response.data);
      alert('Login successful!');
      
    } catch (error) {
      console.log('LOGIN ERROR DETAILS:');
      console.log('- Error message:', error.message);
      console.log('- Response status:', error.response?.status);
      console.log('- Response data:', error.response?.data);
      console.log('- Request URL:', error.config?.url);
      
      alert('Login failed. Check console for details.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Your Account</h2>
        <form onSubmit={onSubmit}>
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
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;