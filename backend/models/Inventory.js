const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  drug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drug',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  batchNumber: String,
  supplier: String,
  isAvailable: {
    type: Boolean,
    default: true
  },
  minStockLevel: {
    type: Number,
    default: 10,
    min: [0, 'Minimum stock level cannot be negative']
  },
  maxStockLevel: {
    type: Number,
    default: 100,
    min: [0, 'Maximum stock level cannot be negative']
  },
  lastRestocked: Date
}, {
  timestamps: true
});

// Compound index for unique drug per pharmacy
inventorySchema.index({ pharmacy: 1, drug: 1 }, { unique: true });

// Index for search and availability
inventorySchema.index({ pharmacy: 1, isAvailable: 1 });
inventorySchema.index({ drug: 1, isAvailable: 1 });

// Virtual for discounted price
inventorySchema.virtual('discountedPrice').get(function() {
  return this.price * (1 - this.discount / 100);
});

// Method to check if stock is low
inventorySchema.methods.isLowStock = function() {
  return this.quantity <= this.minStockLevel;
};

// Static method to find low stock items for a pharmacy
inventorySchema.statics.findLowStock = function(pharmacyId) {
  return this.find({
    pharmacy: pharmacyId,
    quantity: { $lte: '$minStockLevel' }
  });
};

module.exports = mongoose.model('Inventory', inventorySchema);