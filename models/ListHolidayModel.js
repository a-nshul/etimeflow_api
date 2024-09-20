const mongoose = require('mongoose');
const moment = require('moment');  // Ensure moment is required

// Define the schema
const listHolidaySchema = new mongoose.Schema({
    occasion: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 50,
        minLength: 3,
    },
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    date: {
        type: Date,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return moment(value).isValid() && moment(value).format('YYYY-MM-DD') === value.toISOString().split('T')[0];
            },
            message: 'Date must be in the format YYYY-MM-DD.',
        },
    },
    city: {
        type: String,
        required: true,
        maxLength: 50,
        minLength: 3,
    },
    country: {
        type: String,
        required: true,
        maxLength: 50,
        minLength: 3,
    },
}, { timestamps: true });


// Create and export the model
const ListHoliday = mongoose.model("ListHoliday", listHolidaySchema);

module.exports = ListHoliday;
