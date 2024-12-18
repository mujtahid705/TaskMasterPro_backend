const asyncHandler = require("express-async-handler");
const projectModel = require("../models/projectModel");

// @desc Get projects
// @route POST /api/projects
// @access Private
const getProjects = asyncHandler(async (req, res) => {
  const admin_id = req.body.admin_id;
  const projects = await projectModel.find();

  const filteredProjects = projects.filter(
    (item) => item.createdBy == admin_id
  );
  res.status(200).json(filteredProjects);
});

// @desc Get project by id
// @route GET /api/projects/:id
// @access Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectModel.findById(req.params.id);

  // HAVE TO ADD ACCESS FOR EMPLOYEES
  if (project.createdBy.toString() !== req.admin.id) {
    res.status(400);
    throw new Error("Not authorized");
  }
  res.status(200).json(project);
});

// @desc Create project
// @route POST /api/projects
// @access Private
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const project = await projectModel.create({
    name,
    description,
    createdBy: req.admin.id,
    assignedTo: req.body.assignedTo ? req.body.assignedTo : [],
    status: req.body.status ? req.body.status : "Not Started",
    tasks: [],
  });
  res.status(201).json({ message: "Project created", project });
});

// @desc Update project
// @route PUT /api/projects/:id
// @access Private
const updateProject = asyncHandler(async (req, res) => {
  const project = await projectModel.findById(req.params.id);
  const { name, description, status, assignedTo } = req.body;

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!name || !description || !status || !assignedTo) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const updatedProject = await projectModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      status,
      assignedTo,
      createdBy: req.admin.id,
    },
    { new: true }
  );
  res.status(200).json(updatedProject);
});

// @desc Delete project
// @route DELETE /api/projects/:id
// @access Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await projectModel.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await projectModel.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Project deleted" });
});

// @desc Add task
// @route PUT /api/projects/task/:id
// @access Private
const addTask = asyncHandler(async (req, res) => {
  const project = await projectModel.findById(req.params.id);
  const { title, description } = req.body;

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!title || !description) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // ***HAVE TO ADD ACCESS FOR EMPLOYEES***
  if (project.createdBy.toString() !== req.admin.id) {
    res.status(404);
    throw new Error("Not authorized");
  }

  project.tasks.push({ title, description, status: "Not Completed" });

  const updatedProject = await projectModel.findByIdAndUpdate(
    req.params.id,
    project,
    { new: true }
  );
  res.status(200).json({ title, description, status: "Not Completed" });
});

// @desc Get tasks
// @route GET /api/projects/task/:id
// @access Private
const getTask = asyncHandler(async (req, res) => {
  const project = await projectModel.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // ***HAVE TO ADD ACCESS FOR EMPLOYEES***
  if (project.createdBy.toString() !== req.admin.id) {
    res.status(404);
    throw new Error("Not authorized");
  }

  res.status(200).json(project.tasks);
});

// @desc Update task status
// @route PUT /api/projects/task-status/:id
// @access Private
const updateTask = asyncHandler(async (req, res) => {
  const project = await projectModel.findById(req.params.id);
  const { taskId, status } = req.body;

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!status) {
    res.status(400);
    throw new Error("status required");
  }

  // ***HAVE TO ADD ACCESS FOR EMPLOYEES***
  if (project.createdBy.toString() !== req.admin.id) {
    res.status(404);
    throw new Error("Not authorized");
  }

  let temp = [];
  project.tasks.map((task) => {
    if (taskId.toString() !== task._id.toString()) {
      temp.push(task);
    } else {
      temp.push({ ...task, status });
    }
  });

  project.tasks = temp;

  const updatedProject = await projectModel.findByIdAndUpdate(
    req.params.id,
    project,
    { new: true }
  );
  res.status(200).json(updatedProject);
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addTask,
  getTask,
  updateTask,
};
