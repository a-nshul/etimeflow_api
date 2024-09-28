// const express = require("express");
// const connectDB = require("./config/db");
// const dotenv = require("dotenv");
// const path = require("path");
// const swaggerSetup = require('./swagger'); // Import Swagger setup
// const cors = require("cors");
// const userRoutes = require("./routes/userRoutes");
// const profileRoutes = require("./routes/profileRoutes");
// const leaveRoutes = require("./routes/leaveRoutes");
// const listHolidayRoutes = require('./routes/listHolidayRoutes');
// const salaryRoutes = require('./routes/salaryRoutes');
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// dotenv.config();
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Swagger setup
// // swaggerSetup(app); // Make sure this is called before your routes
// console.log("Setting up Swagger at /api-docs");

// swaggerSetup(app);

// console.log("Swagger setup complete");


// // API routes
// app.use("/api/user", userRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/leave", leaveRoutes);
// app.use("/api/holidays", listHolidayRoutes);
// app.use("/api/salary", salaryRoutes);

// // Error handling middleware
// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 3001;

// const server = app.listen(
//   PORT,
//   console.log(`Server running on PORT ${PORT}...`)
// );
const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const path = require("path");
const swaggerSetup = require('./swagger'); // Import Swagger setup
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const listHolidayRoutes = require('./routes/listHolidayRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debugging log to verify if the swaggerSetup function is properly imported
console.log("Swagger Setup Type:", typeof swaggerSetup); // Should log 'function'

if (typeof swaggerSetup === 'function') {
    // Swagger setup - ensure this is called before defining routes
    console.log("Setting up Swagger at /api-docs");
    swaggerSetup(app);
    console.log("Swagger setup complete");
} else {
    console.error("swaggerSetup is not a function. Please check the swagger.js file.");
}

// API routes
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/holidays", listHolidayRoutes);
app.use("/api/salary", salaryRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);
