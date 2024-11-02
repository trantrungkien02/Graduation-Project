const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: false,
    },
    discuss: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Lesson', lessonSchema);
