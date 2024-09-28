const express = require('express');
const {
  createHoliday,
  getHolidays,
  updateHoliday,
  deleteHoliday,
  getHolidayById,
} = require('../controllers/listHolidayController');
const { isHR, protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/holidays:
 *   get:
 *     summary: Get all holidays
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of holidays retrieved successfully
 */
router.get('/', protect, getHolidays);

/**
 * @swagger
 * /api/holidays:
 *   post:
 *     summary: Create a new holiday (only HR can create)
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               occasion:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Holiday created successfully
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, isHR, createHoliday);

/**
 * @swagger
 * /api/holidays/{id}:
 *   put:
 *     summary: Update a holiday (only HR can update)
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the holiday to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               occasion:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Holiday updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Holiday not found
 */
router.put('/:id', protect, isHR, updateHoliday);

/**
 * @swagger
 * /api/holidays/{id}:
 *   delete:
 *     summary: Delete a holiday (only HR can delete)
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the holiday to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Holiday deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Holiday not found
 */
router.delete('/:id', protect, isHR, deleteHoliday);

/**
 * @swagger
 * /api/holidays/{id}:
 *   get:
 *     summary: Get holiday data by ID
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the holiday to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Holiday retrieved successfully
 *       404:
 *         description: Holiday not found
 */
router.get('/:id', protect, getHolidayById);

module.exports = router;
