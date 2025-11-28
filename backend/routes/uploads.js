const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');
const { getFile } = require('../utils/gridfsStorage');

const router = express.Router();

// Stream certificate file from GridFS by filename (public access for certificates)
router.get('/certificates/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;

    const fileInfo = await getFile(filename);
    if (!fileInfo) {
      return res.status(404).json({ 
        message: 'File not found',
        filename: filename
      });
    }

    // Set appropriate headers
    res.set('Content-Type', fileInfo.file.contentType || 'application/octet-stream');
    res.set('Content-Disposition', `inline; filename="${fileInfo.file.metadata?.originalName || fileInfo.file.filename}"`);
    
    // Add cache control for better performance
    res.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache

    const downloadStream = fileInfo.bucket.openDownloadStream(fileInfo.file._id);
    
    downloadStream.on('error', (err) => {
      console.error('GridFS download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error streaming file' });
      }
    });
    
    downloadStream.pipe(res);
    
  } catch (err) {
    console.error('Error streaming file:', err);
    res.status(500).json({ 
      message: 'Error streaming file', 
      error: process.env.NODE_ENV === 'production' ? {} : err.message 
    });
  }
});

// Stream certificate file from GridFS by id (authenticated route)
router.get('/certificates/id/:id', auth, async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: 'Invalid file id' });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'certificates' });

    // Find file info
    const filesColl = db.collection('certificates.files');
    const fileDoc = await filesColl.findOne({ _id: new ObjectId(fileId) });
    if (!fileDoc) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', fileDoc.contentType || 'application/octet-stream');
    res.set('Content-Disposition', `inline; filename="${fileDoc.metadata?.originalName || fileDoc.filename}"`);

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    downloadStream.on('error', (err) => {
      console.error('GridFS download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error streaming file' });
      }
    });
    
    downloadStream.pipe(res);
    
  } catch (err) {
    console.error('Error streaming file:', err);
    res.status(500).json({ 
      message: 'Error streaming file', 
      error: process.env.NODE_ENV === 'production' ? {} : err.message 
    });
  }
});

module.exports = router;