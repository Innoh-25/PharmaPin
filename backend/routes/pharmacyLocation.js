const express = require('express');
const Pharmacy = require('../models/Pharmacy');
const auth = require('../middleware/auth');

const router = express.Router();

// Set pharmacy location (after approval)
router.post('/set-location', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pharmacist') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { latitude, longitude, address } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Find pharmacist's pharmacy
    const pharmacy = await Pharmacy.findOne({ 
      owner: req.user.id,
      status: 'approved'
    });

    if (!pharmacy) {
      return res.status(404).json({ 
        message: 'Pharmacy not found or not approved' 
      });
    }

    // Update location
    pharmacy.location = {
      type: 'Point',
      coordinates: [longitude, latitude] // MongoDB uses [lng, lat]
    };
    
    // Also update address coordinates if provided
    if (address) {
      pharmacy.address.address = address;
    }
    
    pharmacy.address.coordinates = {
      lat: latitude,
      lng: longitude
    };
    
    pharmacy.locationSet = true;

    await pharmacy.save();

    res.json({
      success: true,
      message: 'Pharmacy location set successfully',
      pharmacy: pharmacy
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to set location', 
      error: error.message 
    });
  }
});

// Get pharmacy location status
router.get('/location-status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pharmacist') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const pharmacy = await Pharmacy.findOne({ owner: req.user.id });
    
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    res.json({
      locationSet: pharmacy.locationSet,
      coordinates: pharmacy.location.coordinates,
      address: pharmacy.address
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get location status', 
      error: error.message 
    });
  }
});

module.exports = router;