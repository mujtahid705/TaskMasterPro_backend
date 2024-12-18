const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const employeeModel = require("../models/employeeModel");

// @desc Get employees
// @route POST /api/employees/
// @access private
const getEmployees = asyncHandler(async (req, res) => {
  const admin_id = req.admin.id;
  const employees = await employeeModel.find();

  const filteredEmployees = employees.filter(
    (item) => item.admin_id.toString() == admin_id
  );

  let employeesResponse = [];
  filteredEmployees.forEach((element) => {
    const temp = {
      id: element._id,
      name: element.name,
      role: element.role,
      admin_id: element.admin_id,
      username: element.username,
    };
    employeesResponse.push(temp);
  });

  res.status(200).json(employeesResponse);
});

// @desc Get specific employee
// @route GET /api/employees/:id
// @access private
const getEmployee = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const employee = await employeeModel.findById(id);

  if (employee.admin_id.toString() !== req.admin.id.toString()) {
    res.status(400);
    throw new Error("Unauthorized Admin");
  }

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const employeeData = {
    name: employee.name,
    id: employee._id,
    admin_id: employee.admin_id,
    username: employee.username,
    role: employee.role,
  };

  res.status(200).json(employeeData);
});

// @desc Create employee
// @route POST /api/employees/create
// @access private
const createEmployee = asyncHandler(async (req, res) => {
  const { name, username, password, role } = req.body;

  if (!name || !username || !password || !role) {
    res.status(401);
    throw new Error("Complete the form");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newEmployee = await employeeModel.create({
    name,
    username,
    password: hashedPassword,
    role,
    admin_id: req.admin.id,
  });

  res.status(200).json({
    name,
    username,
    role,
    admin_id: req.admin.id,
  });
});

// @desc Delete employee
// @route Delete /api/employees/:id
// @access private
const deleteEmployee = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const employee = await employeeModel.findById(id);

  if (employee.admin_id.toString() !== req.admin.id) {
    res.status(400);
    throw new Error("Unauthorized Admin");
  }

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  await employeeModel.deleteOne({ _id: id });
  res.status(200).json({ message: "Employee deleted" });
});

// @desc Update employee
// @route PUT /api/employees/:id
// @access private
const updateEmployee = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const employee = await employeeModel.findById(id);
  const { name, username, password, role } = req.body;

  if (employee.admin_id.toString() !== req.admin.id) {
    res.status(400);
    throw new Error("Unauthorized Admin");
  }

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  if (!name || !username || !password || !role) {
    res.status(401);
    throw new Error("Complete the form");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updated = await employeeModel.findByIdAndUpdate(
    id,
    {
      name,
      username,
      role,
      password: hashedPassword,
      admin_id: req.admin.id,
    },
    { new: true }
  );
  res.status(200).json({ message: "Employee updated" });
});

module.exports = {
  getEmployee,
  getEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee,
};
