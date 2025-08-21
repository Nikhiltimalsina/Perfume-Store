const { User } = require('../models');
const { generateToken } = require('../config/auth');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password, phone, address, dateOfBirth } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists',
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      dateOfBirth,
      role: 'user',
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      message: 'Profile retrieved successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Server error retrieving profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { firstName, lastName, phone, address, dateOfBirth } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      address: address || user.address,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
    });

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      message: 'Server error changing password',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const logout = async (req, res) => {
  res.json({
    message: 'Logout successful',
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
};