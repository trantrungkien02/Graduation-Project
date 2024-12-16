const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true, // URL của ảnh là bắt buộc
  },
  courseId: {
    type: String,
    required: false,
  },
  courseSlug: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    default: '', // Tiêu đề ảnh (tùy chọn)
  },
  description: {
    type: String,
    default: '', // Mô tả ngắn gọn về ảnh (tùy chọn)
  },
  createdAt: {
    type: Date,
    default: Date.now, // Thời gian tạo ảnh
  },
  endDate: {
    type: Date,
    required: false, // Thời gian kết thúc (tùy chọn)
    validate: {
      validator: function (value) {
        return value > this.createdAt;
      },
      message: 'Thời gian kết thúc phải sau thời gian tạo.',
    },
  },
  category: {
    type: String,
    default: '', // Danh mục hoặc loại ảnh (tùy chọn)
  },
  tags: [
    {
      type: String,
    },
  ], // Thẻ liên quan đến ảnh
});

module.exports = mongoose.model('Image', bannerSchema);
