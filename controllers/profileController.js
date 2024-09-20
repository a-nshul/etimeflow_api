const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const getProfileByToken = asyncHandler(async (req, res) => {
  try {
      // The user should already be attached to the request object by the protect middleware
      const user = req.user;

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});
const getProfile=asyncHandler(async(req,res)=>{
  try {
    const profile =await User.find();
    if (!profile || profile==0) {
      return res.status(404).json({ message: "No profiles found" });
    }
    res.status(200).json({ profile, message: "All profiles found" });
  } catch (error) {
    res.status(500).json({message:error.message})
  }
});
// Update User Profile with image handling
const updateUserProfile = asyncHandler(async (req, res) => {
  console.log('Received file:', req.file); // Add this line to debug

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.file) {
    user.profileImage = req.file.path; // Save the file path to the user profile
  }

  const allowedFieldsForEmployee = [
    'name',
    'email',
    'gender',
    'bloodGroup',
    'state',
    'city',
    'country',
    'placeOfBirth',
    'pincode',
    'motherTongue',
    'countryCode',
    'education',
    'phoneNumber',
    'yearOfPassing'
  ];

  const updateData = { ...req.body };

  if (user.role === 'employee') {
    Object.keys(updateData).forEach((key) => {
      if (!allowedFieldsForEmployee.includes(key)) {
        delete updateData[key];
      }
    });
  }

  Object.keys(updateData).forEach((key) => {
    user[key] = updateData[key] || user[key];
  });

  const updatedUser = await user.save();
  res.json({ message: "Profile updated successfully", user: updatedUser });
});

const updateUserProfileForRole =asyncHandler(async(req,res)=>{

if (req.user.role !== 'HR' && req.user.role !== 'manager') {
    return res.status(403).json({ message: "Access denied" });
  }

  const { userId } = req.params;
  const userToUpdate = await User.findById(userId);

  if (!userToUpdate) {
    return res.status(404).json({ message: "User not found" });
  }

  const updateData = { ...req.body };

  // Ensure that only HR and Managers can update the following fields
  const allowedFieldsForHRManager = [
    'empCode',
    'designation',
    'userGroup',
    'dateOfJoining',
    'managerName',
    'teamMembers',
    'reportingManager'
  ];

  Object.keys(updateData).forEach((key) => {
    if (!allowedFieldsForHRManager.includes(key)) {
      delete updateData[key]; // Remove fields not allowed for HR or Managers
    }
  });

  // Apply the updates
  Object.keys(updateData).forEach((key) => {
    userToUpdate[key] = updateData[key] || userToUpdate[key];
  });

  const updatedUser = await userToUpdate.save();
  res.json({ message: "Profile updated successfully", user: updatedUser });
});
module.exports = { updateUserProfileForRole,updateUserProfile,getProfile,getProfileByToken };

