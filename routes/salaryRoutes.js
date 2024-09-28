const express = require('express');
const {
  uploadSalary,
  getSalarybyId,
  getSalary
} = require('../controllers/salaryController');
const { protect, authorize, isHR } = require('../middleware/authMiddleware');
const multer = require('multer');  // To handle file uploads

const router = express.Router();

// Configure multer for file upload
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
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs are allowed'));
    }
  }
});

/**
 * @swagger
 * /api/salary/upload:
 *   post:
 *     summary: Upload salary PDF (Only accessible by HR)
 *     tags: [Salary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               salaryPdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Salary PDF uploaded successfully
 *       401:
 *         description: Not authorized
 */
router.post('/upload', protect, isHR, upload.single('salaryPdf'), uploadSalary);

/**
 * @swagger
 * /api/salary/{userId}:
 *   get:
 *     summary: Get salary details by user ID
 *     tags: [Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve salary details for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Salary details retrieved successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
router.get('/:userId', protect, authorize('employee', 'manager'), getSalarybyId);

/**
 * @swagger
 * /api/salary:
 *   get:
 *     summary: Get all salary records
 *     tags: [Salary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of salary records retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get("/", protect, getSalary);

module.exports = router;
