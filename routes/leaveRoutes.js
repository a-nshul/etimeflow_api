const express = require("express");
const {
  createLeave,
  updateLeaveStatus,
  getLeaveDetailsforUser,
  deleteLeaveRequest,
  getRemainingLeave,
  getLeaveDetails
} = require("../controllers/leaveController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/leave/create:
 *   post:
 *     summary: Create a leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveType:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave request created successfully
 *       401:
 *         description: Not authorized
 */
router.post("/create", protect, createLeave);

/**
 * @swagger
 * /api/leave/status:
 *   post:
 *     summary: Update leave status (approve/reject)
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave status updated successfully
 *       401:
 *         description: Not authorized
 */
router.post("/status", protect, updateLeaveStatus);

/**
 * @swagger
 * /api/leave/delete:
 *   post:
 *     summary: Delete a leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave request deleted successfully
 *       401:
 *         description: Not authorized
 */
router.post("/delete", protect, deleteLeaveRequest);

/**
 * @swagger
 * /api/leave/details:
 *   get:
 *     summary: Get leave details for HR or employee
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave details retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get("/details", protect, getLeaveDetails);

/**
 * @swagger
 * /api/leave:
 *   get:
 *     summary: Get all leave requests for the user
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave requests retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get("/", protect, getLeaveDetailsforUser);

/**
 * @swagger
 * /api/leave/remaining:
 *   get:
 *     summary: Get remaining leave balance
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Remaining leave balance retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get("/remaining", protect, getRemainingLeave);

module.exports = router;
