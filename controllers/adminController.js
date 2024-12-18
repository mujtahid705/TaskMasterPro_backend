const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

// @desc Login admin
// @route POST /api/admins/login
// @access public
const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(400).json({ message: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = jwt.sign(
    { admin: { id: admin._id, username: admin.username } },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      username: admin.username,
      role: admin.toObject().role,
    },
  });
});

// @desc Register admin
// @route POST /api/admins/register
// @access public
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const adminExists = await Admin.findOne({ username });

  if (adminExists) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    name,
    username,
    password: hashedPassword,
    role: "Admin",
  });
  res
    .status(201)
    .json({
      message: "Admin created",
      admin: { name, username, role: admin.role },
    });
});

// @desc Get all admins
// @route GET /api/admins
// @access private
const getAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find();
  res.status(200).json(admins);
});

// @desc Get specific admin
// @route GET /api/admins/:id
// @access public
const getAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  res.status(200).json(admin);
});

module.exports = { loginAdmin, registerAdmin, getAdmins, getAdmin };
