const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  lessonId: {
    type: String,
    ref: 'Lesson',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    default: '', // Optional if you want a default avatar
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      userId: {
        type: String,
        ref: 'User',
        required: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      avatarUrl: {
        type: String,
        default: '',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Comment', commentSchema);
