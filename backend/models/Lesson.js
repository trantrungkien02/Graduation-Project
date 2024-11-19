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
      required: false, // Không bắt buộc nếu là bài thực hành
    },
    duration: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      default: 'video',
    },
    discuss: {
      type: String,
      required: false,
    },
    quesList: [
      {
        quesName: {
          type: String,
          required: true, // Tên câu hỏi bắt buộc
        },
        a: {
          type: String,
          required: true, // Đáp án A bắt buộc
        },
        b: {
          type: String,
          required: true, // Đáp án B bắt buộc
        },
        c: {
          type: String,
          required: true, // Đáp án C bắt buộc
        },
        d: {
          type: String,
          required: true, // Đáp án D bắt buộc
        },
        quesCorrect: {
          type: String,
          required: true, // Đáp án đúng bắt buộc
        },
        explanation: {
          type: String,
          required: false, // Giải thích không bắt buộc
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Lesson', lessonSchema);
