const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const path = require('path');

// Create GridFS storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `certificate-${uniqueSuffix}${path.extname(file.originalname)}`;
      
      const fileInfo = {
        filename: filename,
        bucketName: 'certificates',
        metadata: {
          originalName: file.originalname,
          uploadedBy: req.user ? req.user.id : null,
          uploadDate: new Date()
        }
      };
      resolve(fileInfo);
    });
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow only specific file types
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
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  }
});

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

// Function to delete file by filename
const deleteFile = async (filename) => {
  try {
    const fileInfo = await getFile(filename);
    if (!fileInfo) {
      return false;
    }

    await fileInfo.bucket.delete(fileInfo.file._id);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

module.exports = {
  upload,
  getFile,
  deleteFile
};