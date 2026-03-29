const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * generateToken — Creates a signed JWT containing the user's ID.
 * Token expires in 30 days.
 * @param {string} id — MongoDB user _id
 * @returns {string} signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * register — Creates a new user account.
 * Route: POST /api/auth/register
 * Body: { name, email, password }
 * Returns: { success, data: { user, token }, message }
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'A user with this email already exists',
      });
    }

    // Create user (password is hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
        },
        token,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Server error during registration',
    });
  }
};

/**
 * login — Authenticates a user with email + password.
 * Route: POST /api/auth/login
 * Body: { email, password }
 * Returns: { success, data: { user, token }, message }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Please provide email and password',
      });
    }

    // Find user and explicitly include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password',
      });
    }

    // Check if user has a password (OAuth-only users won't)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'This account uses OAuth login. Please sign in with GitHub or LinkedIn.',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Server error during login',
    });
  }
};

/**
 * getMe — Returns the currently authenticated user's profile.
 * Route: GET /api/auth/me (protected)
 * Relies on authMiddleware attaching req.user
 * Returns: { success, data: { user }, message }
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          githubId: user.githubId,
          linkedinId: user.linkedinId,
          createdAt: user.createdAt,
        },
      },
      message: 'User profile retrieved',
    });
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Server error retrieving profile',
    });
  }
};

module.exports = { register, login, getMe };
