const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addTask,
  getTask,
  updateTask,
} = require("../controllers/projectController");
const validateAdminToken = require("../middleware/validateAdminToken");

// Middleware
router.use(validateAdminToken);

// Get all projects
router.post("/", getProjects);

// Get project by id
router.get("/:id", getProjectById);

// Create project
router.post("/create", createProject);

// Update project
router.put("/:id", updateProject);

// Delete project
router.delete("/:id", deleteProject);

// Add Task
router.put("/task/:id", addTask);

// Get Task
router.get("/task/:id", getTask);

// Update task status
router.put("/task-status/:id", updateTask);

module.exports = router;
