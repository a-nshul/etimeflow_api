const express = require("express");
const {
  updateUserProfile,
  getProfile,
  getProfileByToken,
  updateUserProfileForRole
} = require("../controllers/profileController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../models/uploadMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               role:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
router.route("/").put(protect, upload.single("profileImage"), updateUserProfile);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.route("/").get(protect, getProfile);

/**
 * @swagger
 * /api/profile/by-token:
 *   get:
 *     summary: Get user profile by token
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.route('/by-token').get(protect, getProfileByToken);

/**
 * @swagger
 * /api/profile/{userId}:
 *   put:
 *     summary: Update user profile by role (HR or Manager)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empCode:
 *                 type: string
 *               designation:
 *                 type: string
 *               userGroup:
 *                 type: string
 *               dateOfJoining:
 *                 type: string
 *               managerName:
 *                 type: string
 *               teamMembers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.put('/:userId', protect, authorize('HR', 'manager'), updateUserProfileForRole);

module.exports = router;
