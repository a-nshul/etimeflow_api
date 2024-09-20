const asyncHandler = require('express-async-handler');
const ListHoliday = require('../models/ListHolidayModel');

// Create a new holiday - Only HR can create
const createHoliday = asyncHandler(async (req, res) => {
  try {
    const { occasion, date, city, country,day } = req.body;
    if(!occasion || !date || !country || !city || !day){
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
  
    const newHoliday = await ListHoliday.create({ occasion, date, city, country,day });
    
    res.status(201).json({ holiday: newHoliday,message: 'Holiday created successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message:error.message});
  }
});

// Get all holidays - Accessible to all roles
const getHolidays = asyncHandler(async (req, res) => {
  const holidays = await ListHoliday.find();
  const countDocument=await ListHoliday.countDocuments();
  res.status(200).json({ countDocument,holidays });
});

const getHolidayById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Find the holiday by ID
    const holiday = await ListHoliday.findById(id);
  
    // Check if the holiday exists
    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }
  
    // Respond with the holiday
    res.status(200).json({ holiday,message:"Holiday found by ID" });
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ message: 'Error retrieving holiday', error: error.message });
  }
});
// Update a holiday - Only HR can update
const updateHoliday = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { occasion, date, city, country,day } = req.body;
   if(!occasion || ! date || !city || !country || !day){
     return res.status(400).json({ message: 'Please provide all required fields' });
   }
    try {
      // Update the holiday by ID
      const holiday = await ListHoliday.findByIdAndUpdate(
        id,
        { occasion, date, city, country,day }, // Fields to update
        { new: true, runValidators: true } // Options: return updated doc and run validators
      );
  
      // Check if the holiday exists
      if (!holiday) {
        return res.status(404).json({ message: 'Holiday not found' });
      }
  
      // Respond with success message
      res.status(200).json({ message: 'Holiday updated successfully', holiday });
    } catch (error) {
      // Handle any errors that occurred during the process
      res.status(500).json({ message: 'Error updating holiday', error: error.message });
    }
  });

// Delete a holiday - Only HR can delete
const deleteHoliday = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find and delete the holiday by ID
      const holiday = await ListHoliday.findByIdAndDelete(id);
  
      // Check if the holiday exists
      if (!holiday) {
        return res.status(404).json({ message: 'Holiday not found' });
      }
  
      // Respond with success message
      res.status(200).json({ message: 'Holiday deleted successfully' ,data:holiday});
    } catch (error) {
      // Handle any errors that occurred during the process
      res.status(500).json({ message: 'Error deleting holiday', error: error.message });
    }
  });

module.exports = { createHoliday, getHolidays, getHolidayById,updateHoliday, deleteHoliday };
