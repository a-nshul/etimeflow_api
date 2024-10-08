const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const listHolidayRoutes = require('./routes/listHolidayRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000", // Local development URL
    "https://etimeflow-api-uinf.vercel.app", // Your live API URL
    "https://etimeflow-project-y194.vercel.app" // Your frontend URL
  ],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  exposedHeaders: ["X-Auth-Token"], // Expose custom headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  preflightContinue: false,
  optionsSuccessStatus: 204, // For older browsers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/holidays", listHolidayRoutes);
app.use("/api/salary", salaryRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});
