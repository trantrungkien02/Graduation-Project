const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true, // URL của ảnh là bắt buộc
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
