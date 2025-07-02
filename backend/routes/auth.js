const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists (by email or username)
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    const existingUserByUsername = await User.findOne({ fullName: username });
    if (existingUserByUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username is already taken' 
      });
    }

    // Create new user
    const user = new User({
      fullName: username,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.fullName,
        email: user.email,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.fullName,
        email: user.email,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Middleware to verify JWT (copied from posts.js)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      username: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user's profile picture
router.get('/profile-pic', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ profilePic: user.profilePic });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Multer setup for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ storage });

// Update user profile
router.post('/profile', authenticateToken, upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, password } = req.body;
    if (username) user.fullName = username;
    if (password && password.length >= 6) user.password = password;
    if (req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
    }
    await user.save();
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.fullName,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Request password reset
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'No user with that email' });

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
  await user.save();

  // Simulate sending email by logging reset link
  const resetLink = `http://localhost:5173/set-new-password?token=${token}&email=${encodeURIComponent(email)}`;
  console.log('Password reset link:', resetLink);

  res.json({ message: 'Password reset link sent (check console in dev)' });
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { email, token, password } = req.body;
  if (!email || !token || !password) return res.status(400).json({ message: 'All fields required' });
  const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ message: 'Password has been reset successfully' });
});

// --- Friends System ---
// Send a friend request
router.post('/friends/request', authenticateToken, async (req, res) => {
  const { toUserId } = req.body;
  if (!toUserId) return res.status(400).json({ message: 'Recipient userId required' });
  if (toUserId === req.user.userId) return res.status(400).json({ message: 'Cannot friend yourself' });
  const fromUser = await User.findById(req.user.userId);
  const toUser = await User.findById(toUserId);
  if (!toUser) return res.status(404).json({ message: 'User not found' });
  if (fromUser.friends.includes(toUserId)) return res.status(400).json({ message: 'Already friends' });
  if (toUser.friendRequests.includes(fromUser._id)) return res.status(400).json({ message: 'Request already sent' });
  toUser.friendRequests.push(fromUser._id);
  await toUser.save();
  res.json({ message: 'Friend request sent' });
});

// Accept a friend request
router.post('/friends/accept', authenticateToken, async (req, res) => {
  const { fromUserId } = req.body;
  if (!fromUserId) return res.status(400).json({ message: 'Sender userId required' });
  const user = await User.findById(req.user.userId);
  const fromUser = await User.findById(fromUserId);
  if (!fromUser) return res.status(404).json({ message: 'User not found' });
  if (!user.friendRequests.includes(fromUserId)) return res.status(400).json({ message: 'No such friend request' });
  // Add each other as friends
  user.friends.push(fromUserId);
  fromUser.friends.push(user._id);
  // Remove the request
  user.friendRequests = user.friendRequests.filter(id => id.toString() !== fromUserId);
  await user.save();
  await fromUser.save();
  res.json({ message: 'Friend request accepted' });
});

// Decline a friend request
router.post('/friends/decline', authenticateToken, async (req, res) => {
  const { fromUserId } = req.body;
  if (!fromUserId) return res.status(400).json({ message: 'Sender userId required' });
  const user = await User.findById(req.user.userId);
  if (!user.friendRequests.includes(fromUserId)) return res.status(400).json({ message: 'No such friend request' });
  user.friendRequests = user.friendRequests.filter(id => id.toString() !== fromUserId);
  await user.save();
  res.json({ message: 'Friend request declined' });
});

// List friends
router.get('/friends', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).populate('friends', 'fullName email profilePic');
  res.json({ friends: user.friends });
});

// List incoming friend requests
router.get('/friends/requests', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).populate('friendRequests', 'fullName email profilePic');
  res.json({ requests: user.friendRequests });
});

// Search users (for adding friends)
router.get('/search-users', authenticateToken, async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) return res.json({ users: [] });
  const user = await User.findById(req.user.userId);
  // Exclude self, friends, and pending requests
  const excludeIds = [user._id, ...user.friends, ...user.friendRequests].map(id => id.toString());
  const regex = new RegExp(q, 'i');
  const users = await User.find({
    $and: [
      { _id: { $nin: excludeIds } },
      { $or: [ { fullName: regex }, { email: regex } ] }
    ]
  }).limit(10);
  res.json({ users: users.map(u => ({
    _id: u._id,
    fullName: u.fullName,
    email: u.email,
    profilePic: u.profilePic
  })) });
});

// Google OAuth setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here you would find or create a user in your DB
  // For now, just pass the profile
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Google OAuth endpoints
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Successful authentication
  const user = req.user;
  // Create a JWT for the user
  const token = jwt.sign({
    id: user.id,
    displayName: user.displayName,
    emails: user.emails,
    provider: 'google'
  }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
  // Redirect to frontend with token
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173/oauth-success';
  res.redirect(`${frontendUrl}?token=${token}`);
});

// JWT authentication middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// Example protected route
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});

// GitHub OAuth setup
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || 'GITHUB_CLIENT_SECRET',
  callbackURL: '/api/auth/github/callback',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  const user = req.user;
  const token = jwt.sign({
    id: user.id,
    displayName: user.displayName,
    emails: user.emails,
    provider: 'github'
  }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173/oauth-success';
  res.redirect(`${frontendUrl}?token=${token}`);
});

// Discord OAuth setup
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID || 'DISCORD_CLIENT_ID',
  clientSecret: process.env.DISCORD_CLIENT_SECRET || 'DISCORD_CLIENT_SECRET',
  callbackURL: '/api/auth/discord/callback',
  scope: ['identify', 'email']
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
  const user = req.user;
  const token = jwt.sign({
    id: user.id,
    displayName: user.username,
    emails: user.email ? [{ value: user.email }] : [],
    provider: 'discord'
  }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173/oauth-success';
  res.redirect(`${frontendUrl}?token=${token}`);
});

module.exports = router; 