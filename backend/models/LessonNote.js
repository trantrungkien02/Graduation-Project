const mongoose = require('mongoose');

const lessonNoteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true, // ID của khóa học, bắt buộc
    },
    courseId: {
      type: String,
      required: true, // ID của khóa học, bắt buộc
    },
    lessonId: {
      type: String,
      required: true, // ID của bài học, bắt buộc
    },
    lessonName: {
      type: String,
      required: true, // Tên bài học, bắt buộc
    },
    text: {
      type: String,
      required: true, // Nội dung ghi chú, bắt buộc
    },
  },
  { timestamps: true }, // Tự động thêm createdAt và updatedAt
);

module.exports = mongoose.model('LessonNote', lessonNoteSchema);
