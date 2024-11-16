const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderId: { type: String, ref: 'User', required: false }, // ID của người gửi
  senderName: { type: String, ref: 'User', required: false },
  receiverId: { type: String, ref: 'User', required: false }, // ID của người nhận
  tittle: { type: String, required: true },
  des: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  readBy: [String],
  type: { type: String, required: false }, // Loại thông báo (ví dụ: 'admin', 'user')
  isGlobal: { type: Boolean, default: false },
  role: { type: String, required: false },
  courseId: { type: String, ref: 'Course', required: false }, // ID khóa học liên quan
  lessonId: { type: String, ref: 'Lesson', required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
