const express = require("express");
const { updateUserProfile, getProfile, getProfileByToken,updateUserProfileForRole } = require("../controllers/profileController");
const { protect,authorize } = require("../middleware/authMiddleware");
const upload = require("../models/uploadMiddleware");

const router = express.Router();

// Route to update the profile
router.route("/").put(protect, upload.single("profileImage"), updateUserProfile);
// Route to get the profile
router.route("/").get(protect, getProfile);

router.route('/by-token').get(protect, getProfileByToken);

router.put('/:userId', protect, authorize('HR', 'manager'), updateUserProfileForRole);

module.exports = router;

