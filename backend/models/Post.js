const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    type: String
  }],
  fileUrl: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema); 