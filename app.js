const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const path = require("path"); 
const swaggerSetup = require('./swagger');
const cors = require("cors"); 
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const profileRoutes=require("./routes/profileRoutes");
const leaveRoutes=require("./routes/leaveRoutes");
const listHolidayRoutes = require('./routes/listHolidayRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
dotenv.config();
connectDB();

// Initialize Express app
const app = express();
swaggerSetup(app);
// Initialize cors middleware
app.use(cors()); // This must be after app is initialized
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/leave",leaveRoutes);
app.use('/api/holidays', listHolidayRoutes);
app.use('/api/salary',salaryRoutes);
// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);
