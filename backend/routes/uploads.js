const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');

const router = express.Router();

// Stream certificate file from GridFS by id.
// Authentication required; further ownership checks can be added in a follow-up.
router.get('/certificates/:id', auth, async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!ObjectId.isValid(fileId)) return res.status(400).json({ message: 'Invalid file id' });

    const db = mongoose.connection.db;
    if (!db) return res.status(500).json({ message: 'Database not connected' });

    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'certificates' });

    // Find file info
    const filesColl = db.collection('certificates.files');
    const fileDoc = await filesColl.findOne({ _id: new ObjectId(fileId) });
    if (!fileDoc) return res.status(404).json({ message: 'File not found' });

    res.set('Content-Type', fileDoc.contentType || 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename="${fileDoc.filename}"`);

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    downloadStream.on('error', (err) => {
      console.error('GridFS download error', err);
      return res.status(500).end();
    });
    downloadStream.pipe(res);
  } catch (err) {
    console.error('Error streaming file', err);
    res.status(500).json({ message: 'Error streaming file', error: err.message });
  }
});

module.exports = router;
