const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const pharmacyRoutes = require('./routes/pharmacies');
const drugRoutes = require('./routes/drugs');
const inventoryRoutes = require('./routes/inventory');
const pharmacyOnboardingRoutes = require('./routes/pharmacyOnboarding');
const adminAuthRoutes = require('./routes/adminAuth');
const adminRoutes = require('./routes/admin');
const patientRoutes = require('./routes/patients');
const patientSearchRoutes = require('./routes/patientSearch');
const pharmacyLocationRoutes = require('./routes/pharmacyLocation');
const geocodeRoutes = require('./routes/geocode');
const uploadRoutes = require('./routes/uploads');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'https://pharma-pin.vercel.app' // Your Vercel frontend - ADD THIS LINE
];

// FRONTEND_ORIGIN from environment
if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(process.env.FRONTEND_ORIGIN);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/pharmacy-onboarding', pharmacyOnboardingRoutes);
app.use('/api/pharmacy-location', pharmacyLocationRoutes);
app.use('/api/drugs', drugRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/patients', patientRoutes);
// Public patient search (drug availability near a location)
app.use('/api/patient-search', patientSearchRoutes);
app.use('/api/geocode', geocodeRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'PharmaPin API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'PharmaPin API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users', 
      pharmacies: '/api/pharmacies',
      drugs: '/api/drugs',
      inventory: '/api/inventory'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

// 404 handler - FIXED VERSION
app.use((req, res) => {
  res.status(404).json({ 
    message: 'API route not found',
    path: req.path,
    method: req.method
  });
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmapin');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
});

module.exports = app;