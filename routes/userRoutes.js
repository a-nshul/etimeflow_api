const express = require("express");
const {
  registerUser,
  authUser,getUser
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/").get(getUser);
module.exports = router;