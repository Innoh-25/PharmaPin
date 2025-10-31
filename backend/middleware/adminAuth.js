const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Admin access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify it's an admin token
    if (decoded.role !== 'admin' || !decoded.isAdmin) {
      return res.status(403).json({ message: 'Admin privileges required' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin account not found' });
    }

    req.admin = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid admin token' });
  }
};

module.exports = adminAuth;