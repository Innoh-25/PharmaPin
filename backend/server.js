const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// FIXED CORS - Allow both ports 3000 and 5173
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'PharmaPin Backend API is running!' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmapin');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});