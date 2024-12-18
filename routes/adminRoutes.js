const express = require("express");
const {
  loginAdmin,
  registerAdmin,
  getAdmins,
  getAdmin,
} = require("../controllers/adminController");
const validateAdminToken = require("../middleware/validateAdminToken");

const router = express.Router();

// Admin Login
router.post("/login", loginAdmin);

// Admin Register
router.post("/register", registerAdmin);

// Get all admins
router.get("/", validateAdminToken, getAdmins);

// Get specific admin
router.get("/", getAdmin);

module.exports = router;
