const express = require('express');
const { uploadSalary, getSalarybyId,getSalary } = require('../controllers/salaryController');
const { protect, authorize, isHR } = require('../middleware/authMiddleware');
const multer = require('multer');  // To handle file uploads
const path = require('path');

const router = express.Router();

// Configure multer for file upload (store files in "uploads/salaries" directory)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/salaries/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs are allowed'));
    }
  }
});

// Route to upload salary PDF (Only accessible by HR)
router.post('/upload', protect, isHR, upload.single('salaryPdf'), uploadSalary);

// Route to get salary details (Accessible by employees and managers)
router.get('/:userId', protect, authorize('employee', 'manager'), getSalarybyId);

router.get("/", protect, getSalary);

module.exports = router;
