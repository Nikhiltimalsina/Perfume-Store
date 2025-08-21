const express = require('express');
const path = require('path');
const fs = require('fs');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/single', authenticateToken, uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

router.post('/multiple', authenticateToken, requireAdmin, uploadMultiple, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`
    }));
    
    res.json({
      message: 'Files uploaded successfully',
      files: files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading files',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

router.delete('/:filename', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { filename } = req.params;
    const uploadDir = process.env.UPLOAD_PATH || 'uploads/';
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: 'File not found'
      });
    }

    fs.unlinkSync(filePath);
    
    res.json({
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      message: 'Error deleting file',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;