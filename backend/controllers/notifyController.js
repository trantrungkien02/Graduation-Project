const Notification = require('../models/Notification');

const notifyController = {
  createNotification: async (req, res) => {
    try {
      const { senderId, senderName, receiverId, tittle, des, role, type, isGlobal, courseId, lessonId } = req.body;

      const newNotification = new Notification({
        senderId,
        senderName,
        receiverId,
        tittle,
        des,
        role,
        type,
        isGlobal: isGlobal || false,
        courseId,
        lessonId,
      });

      const savedNotification = await newNotification.save();
      res.status(201).json(savedNotification);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating notification', error: err });
    }
  },

  getNotificationsByReceiverId: async (req, res) => {
    try {
      const { receiverId, role } = req.params;

      // Điều kiện cơ bản
      const conditions = [{ receiverId }, { isGlobal: true }];

      // Thêm điều kiện dựa vào role
      if (role === '1') {
        conditions.push({ role: 1 });
      } else if (role === '2') {
        conditions.push({ role: 2 });
      }

      const notifications = await Notification.find({
        $or: conditions,
      });

      res.status(200).json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving notifications', error: err });
    }
  },

  updateNotificationsToRead: async (req, res) => {
    try {
      const { receiverId, role } = req.params;

      // Điều kiện truy vấn
      const conditions = [{ receiverId }, { isGlobal: true }];

      if (role === '1') {
        conditions.push({ role: 1 });
      } else if (role === '2') {
        conditions.push({ role: 2 });
      }

      // Cập nhật chỉ cho người dùng hiện tại
      await Notification.updateMany(
        { $or: conditions, readBy: { $ne: receiverId } }, // Loại trừ thông báo đã được đọc bởi người dùng
        { $addToSet: { readBy: receiverId } }, // Thêm người dùng vào danh sách đã đọc
      );

      // Truy vấn lại danh sách thông báo
      const notifications = await Notification.find({ $or: conditions });

      res.status(200).json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating notifications', error: err });
    }
  },
};

module.exports = notifyController;
