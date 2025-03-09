const User = require("../models/User");
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const generateToken = require("../utils/generateToken");

// Register User

const register = asyncHandler(async (req, res) => {
  try {
    const { email, password, name, role} = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    } else if (password.length > 20) {
      return res.status(400).json({ message: "Password must not be up to 20 characters" });
    }
     // check if user already exists
        
     const userExists = await User.findOne({ email })
     if(userExists) {
         return res.status(400).json({message: 'Email aleady exists'});
     }

     const user = await User.create({email, password, name, role })
     const token = generateToken(user._id);

     res.cookie('token', token, {
         path: '/',
         httpOnly: true,
         expires: new Date(Date.now() + 1000 * 86400),   //expires within 24hrs
         sameSite: 'none',
         secure: true
     })

     // Send a success response with user details and token
     if(user) {
         const { _id,email } = user;
         res.status(201).json({_id,email,password, name, role})
     } else {
         console.log(error);
        res.status(400).json({ message: "Invalid Data" });
     }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 24 hours
    sameSite: 'none',
    secure: true,
  });

  const { _id, email: userEmail, name, role } = user;
  res.json({ _id, email: userEmail, name, role });
});


// Get User Profile
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const { _id, email, name, role } = user;
  res.json({ _id, email, name, role });
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { email, name, password, role } = req.body;

  if (email) user.email = email;
  if (name) user.name = name;
  if (password) {
    if (password.length < 8) {
      res.status(400);
      throw new Error("Password must be at least 8 characters");
    }
    if (password.length > 20) {
      res.status(400);
      throw new Error("Password must not exceed 20 characters");
    }
    user.password = password; // Will be hashed by pre-save hook
  }
  if (role) user.role = role;

  const updatedUser = await user.save();
  const { _id, email: updatedEmail, name: updatedName, role: updatedRole } = updatedUser;
  res.json({ _id, email: updatedEmail, name: updatedName, role: updatedRole });
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await User.deleteOne({ _id: user._id });
  res.clearCookie('token', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ message: "User deleted successfully" });
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = { register, loginUser, getUser, updateUser, deleteUser, logoutUser };