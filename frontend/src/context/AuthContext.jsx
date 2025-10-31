import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Base URL for API calls
const API_BASE_URL = 'http://localhost:5000/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set auth token for all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/me`);
          setUser(response.data.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Check pharmacy status for pharmacists
  const checkPharmacyStatus = async (userToken = token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pharmacy-onboarding/status`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      return response.data;
    } catch (error) {
      console.error('Pharmacy status check failed:', error);
      return { hasPharmacy: false, status: 'no_pharmacy' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { data } = response.data;
      setUser(data);
      setToken(data.token);

      // Check pharmacy status for pharmacists
      if (data.role === 'pharmacist') {
        const pharmacyStatus = await checkPharmacyStatus(data.token);
        return { user: data, pharmacyStatus };
      }

      return { user: data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      const { data } = response.data;
      setUser(data);
      setToken(data.token);

      // For pharmacists, we'll handle redirection after registration
      if (data.role === 'pharmacist') {
        return { user: data, requiresOnboarding: true };
      }

      return { user: data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    checkPharmacyStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;