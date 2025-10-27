const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a pharmacy name'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please add license number'],
    unique: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: String,
    email: String
  },
  operatingHours: {
    open: String,
    close: String,
    days: [String]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscription: {
    type: {
      type: String,
      enum: ['monthly', 'yearly', 'none'],
      default: 'none'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);
