const express = require("express");
const validateAdminToken = require("../middleware/validateAdminToken");
const {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

// Middleware
router.use(validateAdminToken);

// Get all employees
router.post("/", getEmployees);

// Get specific employee
router.get("/:id", getEmployee);

// Get create employee
router.post("/create", createEmployee);

// DELETE delete employee
router.delete("/:id", deleteEmployee);

// PUT update employee
router.put("/:id", updateEmployee);

module.exports = router;
