const asyncHandler = require("express-async-handler");
const taskModel = require("../models/taskModel");

// @desc Get All Tasks
// @route GET /api/tasks/
// @access public <!!PRIVATE!!>
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskModel.find();
  res.status(200).json(tasks);
});

// @desc Get Specific Task
// @route GET /api/tasks/:id
// @access public <!!PRIVATE!!>
const getTask = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const task = await taskModel.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found!");
  }
  res.status(200).json(task);
});

// @desc Create Task
// @route POST /api/tasks/
// @access public <!!PRIVATE!!>
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status } = req.body;

  if (!title || !description || !priority || !status) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const newTask = await taskModel.create({
    title,
    description,
    priority,
    status,
    // admin_id
  });
  res.status(200).json({ message: "Task successfully added", task: newTask });
});

// @desc Update Task
// @route PUT /api/tasks/:id
// @access public <!!PRIVATE!!>
const updateTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { title, description, priority, status } = req.body;

  const task = await taskModel.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found!");
  }

  const updatedTask = await taskModel.findByIdAndUpdate(
    id,
    {
      title,
      description,
      priority,
      status,
    },
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Task successfully updated", task: updatedTask });
});

// @desc Delete Task
// @route DELETE /api/tasks/:id
// @access public <!!PRIVATE!!>
const deleteTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await taskModel.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found!");
  }

  await task.deleteOne({ _id: id });
  res.status(200).json({ message: "Task successfully deleted" });
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
