const express = require('express');
const Drug = require('../models/Drug');
const auth = require('../middleware/auth');

const router = express.Router();

// Create drug (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create drugs' });
    }

    const drug = new Drug(req.body);
    await drug.save();

    res.status(201).json(drug);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create drug', error: error.message });
  }
});

// Get all drugs with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      form,
      prescriptionRequired
    } = req.query;

    let query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Form filter
    if (form) {
      query.form = form;
    }

    // Prescription filter
    if (prescriptionRequired !== undefined) {
      query.prescriptionRequired = prescriptionRequired === 'true';
    }

    const drugs = await Drug.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Drug.countDocuments(query);

    res.json({
      drugs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get drug by ID
router.get('/:id', async (req, res) => {
  try {
    const drug = await Drug.findById(req.params.id);
    
    if (!drug || !drug.isActive) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    res.json(drug);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update drug (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const drug = await Drug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    res.json(drug);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
});

// Delete drug (admin only - soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const drug = await Drug.findById(req.params.id);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    drug.isActive = false;
    await drug.save();

    res.json({ message: 'Drug deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search drugs with advanced filters
router.get('/search/advanced', async (req, res) => {
  try {
    const {
      query,
      category,
      form,
      minStrength,
      maxStrength,
      prescriptionRequired
    } = req.query;

    let searchQuery = { isActive: true };

    // Text search across multiple fields
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { genericName: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Additional filters
    if (category) searchQuery.category = category;
    if (form) searchQuery.form = form;
    if (prescriptionRequired !== undefined) {
      searchQuery.prescriptionRequired = prescriptionRequired === 'true';
    }

    // Strength range filter
    if (minStrength || maxStrength) {
      searchQuery['strength.value'] = {};
      if (minStrength) searchQuery['strength.value'].$gte = parseFloat(minStrength);
      if (maxStrength) searchQuery['strength.value'].$lte = parseFloat(maxStrength);
    }

    const drugs = await Drug.find(searchQuery)
      .sort({ name: 1 })
      .limit(50);

    res.json(drugs);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

module.exports = router;