const express = require('express');
const Pharmacy = require('../models/Pharmacy');
const User = require('../models/Users');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Get all pending pharmacy approvals
router.get('/pharmacies/pending', adminAuth, async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ status: 'pending_approval' })
      .populate('owner', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: pharmacies
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all approved pharmacies
router.get('/pharmacies/approved', adminAuth, async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ status: 'approved' })
      .populate('owner', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: pharmacies
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Approve pharmacy
router.put('/pharmacies/:id/approve', adminAuth, async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        isVerified: true,
        approvedBy: req.admin._id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('owner', 'firstName lastName email phone');

    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    res.json({
      success: true,
      message: 'Pharmacy approved successfully',
      data: pharmacy
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reject pharmacy
router.put('/pharmacies/:id/reject', adminAuth, async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        rejectionReason,
        isVerified: false
      },
      { new: true }
    ).populate('owner', 'firstName lastName email phone');

    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    res.json({
      success: true,
      message: 'Pharmacy rejected',
      data: pharmacy
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalPharmacies,
      pendingPharmacies,
      approvedPharmacies,
      totalUsers,
      totalPatients,
      totalPharmacists
    ] = await Promise.all([
      Pharmacy.countDocuments(),
      Pharmacy.countDocuments({ status: 'pending_approval' }),
      Pharmacy.countDocuments({ status: 'approved' }),
      User.countDocuments(),
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'pharmacist' })
    ]);

    res.json({
      success: true,
      data: {
        totalPharmacies,
        pendingPharmacies,
        approvedPharmacies,
        totalUsers,
        totalPatients,
        totalPharmacists
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;