const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

// Use memory storage for Multer
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || 
      file.mimetype === 'image/jpeg' || 
      file.mimetype === 'image/jpg' || 
      file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5
  }
});

// Function to upload buffer to GridFS
const uploadToGridFS = (buffer, originalname, userId) => {
  return new Promise((resolve, reject) => {
    try {
      // Check if MongoDB connection is ready
      if (mongoose.connection.readyState !== 1) {
        return reject(new Error('MongoDB not connected'));
      }

      const db = mongoose.connection.db;
      if (!db) {
        return reject(new Error('Database not available'));
      }

      const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'certificates' });
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `certificate-${uniqueSuffix}${path.extname(originalname)}`;
      
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          originalName: originalname,
          uploadedBy: userId,
          uploadDate: new Date()
        }
      });
      
      uploadStream.write(buffer);
      uploadStream.end();
      
      uploadStream.on('finish', (file) => {
        console.log('GridFS upload finished:', file._id);
        resolve({
          filename: filename,
          fileId: file._id,
          originalName: originalname,
          size: file.length
        });
      });
      
      uploadStream.on('error', (error) => {
        console.error('GridFS upload stream error:', error);
        reject(error);
      });
      
    } catch (error) {
      console.error('Error in uploadToGridFS:', error);
      reject(error);
    }
  });
};

// Function to get file by filename
const getFile = async (filename) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'certificates' });
    const files = await bucket.find({ filename: filename }).toArray();
    
    if (!files || files.length === 0) {
      return null;
    }
    
    return {
      bucket: bucket,
      file: files[0]
    };
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
};

module.exports = {
  upload,
  uploadToGridFS,
  getFile
};