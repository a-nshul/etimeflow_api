const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+\d{1,15}$/.test(v);
        },
        message: "Invalid phone number format. Please use the format: +123456789012."
      },
      default:'+918174885961'
    },
    role: {
      type: String,
      enum: ['employee', 'HR', 'manager'],
      default: 'employee'
    },
    // Additional Profile Fields
    profileImage: { type: String },
    designation: { type: String },
    empCode: { type: String },
    userGroup: { type: String },
    reportingManager: { type: String },
    dateOfJoining: { type: Date },
    businessHead: { type: String },
    gender: { type: String },
    bloodGroup: { type: String },
    state:{
      type: String,
    },
    city:{
      type:String
    },
    country: { type: String },
    placeOfBirth: { type: String },
    pincode: { type: String },
    motherTongue: { type: String },
    countryCode: { type: String },
    education: { type: String },
    yearOfPassing: { type: String },
    managerName: { type: String },
    teamMembers: { type: String },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
