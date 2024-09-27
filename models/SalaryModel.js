const mongoose = require("mongoose");

const salarySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    salaryMonth: {
      type: String,
      required: true,
    },
    salaryPdf: {
      type: String,
      required: true,  // This will store the path to the uploaded salary PDF
    },
  },
  { timestamps: true }
);

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
