const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
// const aws = require('aws-sdk');
// const multerS3 = require('multer-s3');
const router = express.Router();

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face";

// AWS S3 configuration (for future use)
// aws.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });
// const s3 = new aws.S3();
// const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'your-bucket-name';
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: BUCKET_NAME,
//     acl: 'public-read',
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       const ext = path.extname(file.originalname);
//       cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
//     }
//   })
// });

// Multer setup for file uploads (local uploads folder)
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

// Middleware to verify JWT
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

// Create a new post (with optional file)
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }
    const userId = req.user.userId;
    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`; // Local file URL
    }
    const post = new Post({
      content,
      user: userId,
      fileUrl
    });
    await post.save();
    await post.populate('user', 'fullName email profilePic');
    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post._id,
        content: post.content,
        userId: {
          _id: post.user._id,
          fullName: post.user.fullName,
          email: post.user.email,
          profilePic: post.user.profilePic
        },
        likes: post.likes,
        comments: post.comments,
        timestamp: post.createdAt,
        fileUrl: post.fileUrl || null
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error while creating post' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email profilePic');
    res.json({
      posts: posts.map(post => ({
        id: post._id,
        content: post.content,
        userId: {
          _id: post.user._id,
          fullName: post.user.fullName,
          email: post.user.email,
          profilePic: post.user.profilePic
        },
        likes: post.likes,
        comments: post.comments,
        timestamp: post.createdAt,
        fileUrl: post.fileUrl || null
      }))
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

// Get posts by current user
router.get('/my-posts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email profilePic');
    res.json({
      posts: posts.map(post => ({
        id: post._id,
        content: post.content,
        userId: {
          _id: post.user._id,
          fullName: post.user.fullName,
          email: post.user.email,
          profilePic: post.user.profilePic
        },
        likes: post.likes,
        comments: post.comments,
        timestamp: post.createdAt,
        fileUrl: post.fileUrl || null
      }))
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error while fetching user posts' });
  }
});

module.exports = router; 