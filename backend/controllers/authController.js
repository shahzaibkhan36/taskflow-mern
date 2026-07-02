const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatarColor: user.avatarColor,
  avatar: user.avatar,
  bio: user.bio,
});

// @desc   Register
// @route  POST /api/auth/register
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'An account with this email already exists' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ ...formatUser(user), token: generateToken(user._id) });
  } catch (err) { next(err); }
};

// @desc   Login
// @route  POST /api/auth/login
const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ ...formatUser(user), token: generateToken(user._id) });
  } catch (err) { next(err); }
};

// @desc   Get current user
// @route  GET /api/auth/me
const getMe = async (req, res) => {
  res.json(formatUser(req.user));
};

// @desc   Update profile (name, email, password, avatar, bio)
// @route  PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, bio, avatar, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();

    if (email && email !== user.email) {
      const taken = await User.findOne({ email, _id: { $ne: user._id } });
      if (taken) return res.status(400).json({ message: 'Email is already in use by another account' });
      user.email = email.toLowerCase().trim();
    }

    if (avatar !== undefined) {
      // avatar is base64 string or null to remove
      if (avatar && avatar.length > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'Image is too large. Please use an image under 1.5MB.' });
      }
      user.avatar = avatar;
    }

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required to set a new one' });
      const match = await user.matchPassword(currentPassword);
      if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
      if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });
      user.password = newPassword;
    }

    await user.save();
    res.json(formatUser(user));
  } catch (err) { next(err); }
};

// @desc   Search users by name/email
// @route  GET /api/auth/search?q=
const searchUsers = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const exclude = req.query.exclude ? req.query.exclude.split(',') : [];
    const users = await User.find({
      $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }],
      _id: { $ne: req.user._id, $nin: exclude },
    }).select('name email avatarColor avatar').limit(10);
    res.json(users);
  } catch (err) { next(err); }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, searchUsers };
