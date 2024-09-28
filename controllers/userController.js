const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role, managerId } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Ensure role is one of the allowed roles or default to 'employee'
    const userRole = role && ['employee', 'HR', 'manager'].includes(role) ? role : 'employee';

    // Create user
    const newUser = await User.create({
      name,
      email,
      password,
      phoneNumber,
      role: userRole,
      managerId: userRole === 'employee' ? managerId : undefined  // Assign managerId if role is 'employee'
    });

    // Fetch manager data if the role is 'employee'
    let manager = null;
    if (userRole === 'employee' && managerId) {
      manager = await User.findById(managerId);
    }

    // Send success response with token and manager details if available
    res.status(201).json({
      user: newUser,
      token: generateToken(newUser._id),
      manager: manager ? { name: manager.name, email: manager.email } : null, // Include manager info if available
      message: "User created successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// const authUser = asyncHandler(async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate email and password
//     if (!email || !password) {
//       return res.status(400).json({ message: "Please provide all required fields" });
//     }

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Check if password matches
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Send success response with user details and token
//     res.status(200).json({
//       user,
//       token: generateToken(user._id), // Assuming token generation function
//       message: "User logged in successfully"
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Initialize response object
    const response = {
      user,
      token: generateToken(user._id), // Assuming token generation function
      message: "User logged in successfully"
    };

    // If user role is 'employee' or 'HR', get manager's details
    if (user.role === 'employee' || user.role === 'HR') {
      // Fetch the manager details
      const manager = await User.findOne({ _id: user.managerId }); // Assuming managerId is stored in the user document
      if (manager) {
        response.manager = {
          name: manager.name,
          email: manager.email
        };
      } else {
        response.manager = null; // No manager found
      }
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getUser=asyncHandler(async(req,res)=>{
  try {
    const user =await User.find();
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({user,message:"user fetched successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports = {  registerUser, authUser,getUser };