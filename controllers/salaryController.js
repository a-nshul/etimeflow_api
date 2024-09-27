const { message } = require('antd');
const Salary = require('../models/SalaryModel');
const User = require('../models/userModel');

// @desc    HR uploads salary PDF for a user
// @route   POST /api/salary/upload
// @access  HR
const uploadSalary = async (req, res) => {
  try {
    const { userId, salaryMonth } = req.body;

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if salary record already exists for the user and month
    const existingSalary = await Salary.findOne({ userId, salaryMonth });

    if (existingSalary) {
      return res.status(400).json({ message: 'Salary record already exists for this month' });
    }

    // Create new salary record using the create method
    const salary = await Salary.create({
      userId, 
      salaryMonth, 
      salaryPdf: req.file.path // Store the uploaded PDF path
    });

    // Populate the user data in the salary record
    await salary.populate('userId');  // Populate the correct field

    res.status(201).json({ message: 'Salary uploaded successfully', salary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get salary details for employee or manager
// @route   GET /api/salary/:userId
// @access  employee/manager
const getSalarybyId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find salary record by user ID and salary month
    const salary = await Salary.findOne({ userId });

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    // Check if the requested user matches the logged-in user or if the user is a manager
    if (req.user.id !== userId && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied: You cannot view this salary record' });
    }

    res.status(200).json({ salary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getSalary = async(req, res) => {
  try {
    const fetchSalary=await Salary.find();
    if(!fetchSalary){
      return res.status(404).json({ message: "Salary not found" });
    }
    res.status(200).json({fetchSalary,message:"Salary fetched successfully"});
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};
module.exports = {
  uploadSalary,
  getSalarybyId,getSalary
};
