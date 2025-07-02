const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fetch = require('node-fetch');
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

// Delete a post by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user.userId && post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting post' });
  }
});

// --- A2A Agent Endpoints ---
// Capability discovery endpoint
router.get('/a2a/agent-card', (req, res) => {
  res.json({
    id: "socially-agent-001",
    name: "Socially Demo Agent",
    capabilities: ["post-creation", "file-upload", "echo-task"],
    description: "A demo agent for A2A experimentation in Socially.",
    version: "0.1.0"
  });
});

// Task management endpoint
router.post('/a2a/task', async (req, res) => {
  const { task, openAIApiKey } = req.body;
  // Debug log
  console.log('A2A /a2a/task received:', JSON.stringify(task), openAIApiKey ? `(OpenAI key: ${openAIApiKey.slice(0, 6)}...)` : '');
  let message;
  try {
    switch (task.type) {
      case 'reverse':
        message = (task.content || '').split('').reverse().join('');
        break;
      case 'uppercase':
        message = (task.content || '').toUpperCase();
        break;
      case 'length':
        message = `Length: ${(task.content || '').length}`;
        break;
      case 'openai':
        if (!openAIApiKey) {
          return res.status(400).json({ status: 'error', artifact: { message: 'OpenAI API key required.' } });
        }
        // Call OpenAI API (ChatGPT)
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: task.content }
            ]
          })
        });
        const openaiData = await openaiRes.json();
        if (openaiData.choices && openaiData.choices[0] && openaiData.choices[0].message) {
          message = openaiData.choices[0].message.content;
        } else {
          message = openaiData.error?.message || 'No response from OpenAI.';
        }
        break;
      case 'echo':
      default:
        message = `Task received: ${JSON.stringify(task)}`;
        break;
    }
    res.json({
      status: "completed",
      artifact: { message }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', artifact: { message: 'Error processing task: ' + err.message } });
  }
});

module.exports = router; 