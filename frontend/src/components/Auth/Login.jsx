import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      
      const errorMessage = error.response?.data?.message || 'Login failed';
      alert(`Login failed: ${errorMessage}`);
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
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={onChange}
                required
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
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