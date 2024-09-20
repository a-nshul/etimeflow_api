const express = require("express");
const { createLeave, updateLeaveStatus, getLeaveDetailsforUser,deleteLeaveRequest, getRemainingLeave,getLeaveDetails, getPendingDetails } = require("../controllers/leaveController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to post the leave request
router.post("/create", protect, createLeave);

// Route for manager to approve or reject leave
router.post("/status", protect, updateLeaveStatus);

// Route for employee to cancel their leave
router.post("/delete", protect, deleteLeaveRequest);

// Route for HR or Employee to check leave details
router.get("/details", protect, getLeaveDetails);

router.get("/", protect, getLeaveDetailsforUser);
// Route for fetching remaining leave balance
router.get("/remaining", protect, getRemainingLeave);

// router.delete("/", protect, deleteLeaveRequest);

module.exports = router;
