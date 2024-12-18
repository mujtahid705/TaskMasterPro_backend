const express = require("express");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

// Get All Tasks
router.get("/", getTasks);

// Get Specific Task
router.get("/:id", getTask);

// Create Task
router.post("/", createTask);

// Update Task
router.put("/:id", updateTask);

// Create Task
router.delete("/:id", deleteTask);

module.exports = router;
