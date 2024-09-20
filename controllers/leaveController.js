const asyncHandler = require("express-async-handler");
const Leave = require("../models/LeaveModel");
const User = require("../models/userModel");

const countWeekdays = (startDate, endDate) => {
    let count = 0;
    let currentDate = new Date(startDate);
  
    while (currentDate <= new Date(endDate)) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return count;
};

const createLeave = asyncHandler(async (req, res) => {
    const { leaveType, startDate, endDate,reason } = req.body;
    if(!leaveType || !startDate || !endDate || !reason){
      return res.status(400).json({ message: "All fields are required" });
    }
    const userId = req.user._id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Ensure that the user is either an employee or HR
    if (user.role !== "employee" && user.role !== "HR") {
        return res.status(401).json({ message: "Only employees and HR can create leave requests" });
    }

    // Define leave quotas
    const leaveQuota = {
        sickLeave: 6,
        casualLeave: 12
    };

    // Count weekdays (Monday to Friday) only
    const totalLeaveDays = countWeekdays(startDate, endDate);

    // Check the total leave days already taken by the user
    const usedSickLeaveDays = await Leave.aggregate([
        { $match: { User: userId, leaveType: "sick leave", leaveStatus: { $ne: "Cancelled" } } },
        { $group: { _id: "$User", totalDays: { $sum: "$leaveDays" } } }
    ]);

    const usedCasualLeaveDays = await Leave.aggregate([
        { $match: { User: userId, leaveType: "casual leave", leaveStatus: { $ne: "Cancelled" } } },
        { $group: { _id: "$User", totalDays: { $sum: "$leaveDays" } } }
    ]);

    const sickLeaveTaken = usedSickLeaveDays.length > 0 ? usedSickLeaveDays[0].totalDays : 0;
    const casualLeaveTaken = usedCasualLeaveDays.length > 0 ? usedCasualLeaveDays[0].totalDays : 0;

    // Check if the user exceeds the allowed quota based on leave type
    if (leaveType === "sick leave" && (sickLeaveTaken + totalLeaveDays) > leaveQuota.sickLeave) {
        return res.status(400).json({ message: `You have exceeded your sick leave quota of ${leaveQuota.sickLeave} days.` });
    }

    if (leaveType === "casual leave" && (casualLeaveTaken + totalLeaveDays) > leaveQuota.casualLeave) {
        return res.status(400).json({ message: `You have exceeded your casual leave quota of ${leaveQuota.casualLeave} days.` });
    }

    // Find the user's manager
    const manager = await User.findById(user.managerId);
    if (!manager || manager.role !== "manager") {
        return res.status(400).json({ message: "Manager not found for this user" });
    }

    // Create the leave request
    const leaveRequest = await Leave.create({
        User: userId,
        manager: manager._id,
        startDate,
        endDate,
        leaveType,
        leaveDays: totalLeaveDays,
        leaveStatus: "Pending",
        reason
    });

    // Populate the leave request with user and manager details
    const populatedLeave = await Leave.findById(leaveRequest._id)
        .populate('User', 'name email role')
        .populate('manager', 'name email');

    // Notify the user and manager
    // You would typically use a notification system here

    res.status(201).json({
        populatedLeave,
        message: "Leave request was successfully created and is pending manager approval",
        totalLeaveDays
    });
});
const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { leaveId, action } = req.body;
  const leave = await Leave.findById(leaveId);
  const user = await User.findById(req.user._id);

  if (user.role !== "manager") {
      return res.status(401).json({ message: "Only managers can approve or reject leave requests" });
  }

  if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
  }

  const leaveUser = await User.findById(leave.User);
  if (!leaveUser) {
      return res.status(404).json({ message: "User not found" });
  }

  if (action === "approve") {
      leave.leaveStatus = "Approved";
      // Deduct leave from user's quota based on leave type
      if (leave.leaveType === "sick leave") {
          leaveUser.sickLeave -= leave.leaveDays;
      } else if (leave.leaveType === "casual leave") {
          leaveUser.casualLeave -= leave.leaveDays;
      }
      await leaveUser.save();
  } else if (action === "reject") {
      leave.leaveStatus = "Cancelled";
  }

  await leave.save();
  res.status(200).json({ message: `Leave request ${action}d`, leave });
});
const deleteLeaveRequest = asyncHandler(async (req, res) => {
  const { leaveId } = req.body;
  const leave = await Leave.findById(leaveId);

  if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
  }

  const user = await User.findById(req.user._id);

//   if (leave.User.toString() !== req.user._id.toString() && user.role !== 'HR') {
//       return res.status(401).json({ message: "You can only cancel your own leave request or HR can cancel any leave request" });
//   }

  await Leave.deleteOne({ _id: leaveId });

  if (leave.leaveStatus === 'Approved') {
      let leaveQuotaField = leave.leaveType === 'sick leave' ? 'sickLeave' : 'casualLeave';
      user[leaveQuotaField] += leave.leaveDays; // Restore the leave days
      await user.save();
  }

  res.status(200).json({ message: "Leave request has been cancelled" });
});
const getLeaveDetails = asyncHandler(async (req, res) => {
  const { leaveId, userId } = req.query;

  if (leaveId) {
      const leave = await Leave.findById(leaveId).populate('User', 'name email role');
      if (!leave) {
          return res.status(404).json({ message: "Leave request not found" });
      }
      return res.status(200).json({ leave });
  }

  if (userId) {
      const userLeaves = await Leave.find({ User: userId }).populate('User', 'name email role');
      if (userLeaves.length === 0) {
          return res.status(404).json({ message: "No leave requests found for this user" });
      }
      return res.status(200).json({ userLeaves });
  }

  return res.status(400).json({ message: "Please provide either leaveId or userId" });
});

const getLeaveDetailsforUser = asyncHandler(async (req, res) => {
    try {
      // Fetch leave data and populate the manager field
      const leaveData = await Leave.find()
        .populate('User', 'name email')    // Populate user details
        .populate('manager', 'name email'); // Populate manager details
  
      if (!leaveData || leaveData.length === 0) {
        return res.status(404).json({ message: "No leave requests found" });
      }
  
      res.status(200).json({ leaveData, message: "Leave requests found" });
    } catch (error) {
      res.status(500).json({ error: error.message });  // Changed status to 500 for server errors
    }
  });
//   const getRemainingLeave = asyncHandler(async (req, res) => {
//     const userId = req.user._id;

//     // Check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     // Define leave quotas
//     const leaveQuota = {
//         sickLeave: 6,
//         casualLeave: 12
//     };

//     // Calculate used leave days
//     const usedSickLeaveDays = await Leave.aggregate([
//         { $match: { User: userId, leaveType: "sick leave", leaveStatus: { $ne: "Cancelled" } } },
//         { $group: { _id: "$User", totalDays: { $sum: "$leaveDays" } } }
//     ]);

//     const usedCasualLeaveDays = await Leave.aggregate([
//         { $match: { User: userId, leaveType: "casual leave", leaveStatus: { $ne: "Cancelled" } } },
//         { $group: { _id: "$User", totalDays: { $sum: "$leaveDays" } } }
//     ]);

//     const sickLeaveTaken = usedSickLeaveDays.length > 0 ? usedSickLeaveDays[0].totalDays : 0;
//     const casualLeaveTaken = usedCasualLeaveDays.length > 0 ? usedCasualLeaveDays[0].totalDays : 0;

//     // Calculate remaining leave days
//     const remainingSickLeave = leaveQuota.sickLeave - sickLeaveTaken;
//     const remainingCasualLeave = leaveQuota.casualLeave - casualLeaveTaken;

//     res.status(200).json({
//         remainingSickLeave,
//         remainingCasualLeave,
//         message: "Remaining leave balance retrieved successfully"
//     });
// });
const getRemainingLeave = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    // Define leave quotas
    const leaveQuota = {
      sickLeave: 6,
      casualLeave: 12,
    };
  
    // Calculate used leave days
    const usedSickLeaveDays = await Leave.aggregate([
      { $match: { User: userId, leaveType: "sick leave", leaveStatus: { $ne: "Cancelled" } } },
      { $group: { _id: "$User", totalDays: { $sum: "$leaveDays" } } },
    ]);
  
    const usedCasualLeaveDays = await Leave.aggregate([
      { $match: { User: userId, leaveType: "casual leave", leaveStatus: { $ne: "Cancelled" } } },
      { $group: { _id: "$User", totalDays: { $sum: "$leaveDays" } } },
    ]);
  
    // Calculate pending leave days
    const pendingSickLeaveDays = await Leave.aggregate([
      { $match: { User: userId, leaveType: "sick leave", leaveStatus: "Pending" } },
      { $group: { _id: "$User", totalDays: { $sum: "$leaveDays" } } },
    ]);
  
    const pendingCasualLeaveDays = await Leave.aggregate([
      { $match: { User: userId, leaveType: "casual leave", leaveStatus: "Pending" } },
      { $group: { _id: "$User", totalDays: { $sum: "$leaveDays" } } },
    ]);
  
    // Calculate total leave taken and pending for each leave type
    const sickLeaveTaken = usedSickLeaveDays.length > 0 ? usedSickLeaveDays[0].totalDays : 0;
    const casualLeaveTaken = usedCasualLeaveDays.length > 0 ? usedCasualLeaveDays[0].totalDays : 0;
    const pendingSickLeave = pendingSickLeaveDays.length > 0 ? pendingSickLeaveDays[0].totalDays : 0;
    const pendingCasualLeave = pendingCasualLeaveDays.length > 0 ? pendingCasualLeaveDays[0].totalDays : 0;
  
    // Calculate remaining leave days
    const remainingSickLeave = leaveQuota.sickLeave - sickLeaveTaken;
    const remainingCasualLeave = leaveQuota.casualLeave - casualLeaveTaken;
  
    // Respond with leave details including pending leaves
    res.status(200).json({
      remainingSickLeave,
      remainingCasualLeave,
      pendingSickLeave,
      pendingCasualLeave,
      message: "Remaining leave balance retrieved successfully",
    });
  });
  

module.exports = { getRemainingLeave,getLeaveDetailsforUser,createLeave, getLeaveDetails,updateLeaveStatus,deleteLeaveRequest};
