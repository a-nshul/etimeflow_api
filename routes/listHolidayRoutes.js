const express = require('express');
const router = express.Router();
const {
  createHoliday,
  getHolidays,
  updateHoliday,
  deleteHoliday,getHolidayById,
} = require('../controllers/listHolidayController');
const { isHR } = require('../middleware/authMiddleware'); // Middleware to check if user is HR
const { protect } = require('../middleware/authMiddleware'); // Middleware for authentication

// Get all holidays (accessible to all users)
router.get('/', protect, getHolidays);

// Create a new holiday (only HR can create)
router.post('/', protect, isHR, createHoliday);

// Update a holiday (only HR can update)
router.put('/:id', protect, isHR, updateHoliday);

// Delete a holiday (only HR can delete)
router.delete('/:id', protect, isHR, deleteHoliday);

//Get Holiday data by id
router.get('/:id', protect, getHolidayById);
module.exports = router;
