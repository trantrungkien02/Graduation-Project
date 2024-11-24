const Notification = require('../models/Notification');
const User = require('../models/User');
const Course = require('../models/Course');

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

  createNotificationForCourse: async (req, res) => {
    try {
      const { courseId, userId, userName, tittle, des } = req.body;

      // Tìm khóa học
      const course = await Course.findOne({ slug: courseId });
      if (!course) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học.' });
      }

      // Tạo thông báo chung cho tất cả người dùng đã đăng ký khóa học
      const notification = new Notification({
        senderId: userId, // ID giảng viên
        senderName: userName, // Tên giảng viên
        receiverId: '', // Rỗng vì thông báo dành cho nhiều người
        tittle: tittle || `Thông báo mới từ khóa học ${course.name}`,
        des: des || `Một thông báo mới liên quan đến khóa học "${course.name}" của bạn.`,
        courseId: course.slug,
        type: 'course-notification', // Loại thông báo
      });

      // Lưu thông báo vào DB
      await notification.save();

      res.status(200).json({ message: 'Tạo thông báo thành công.', notification });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi tạo thông báo.', error: err });
    }
  },
  getNotificationsByReceiverId: async (req, res) => {
    try {
      const { receiverId, role } = req.params;

      // Tìm user theo receiverId
      const user = await User.findById(receiverId).select('registeredCourses');
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại.' });
      }

      // Lấy danh sách courseId từ registeredCourses
      const registeredCourseIds = user.registeredCourses.map(course => course.courseSlug);

      // Điều kiện cơ bản cho thông báo
      const conditions = [
        { receiverId }, // Thông báo dành riêng cho người dùng
        { isGlobal: true }, // Thông báo toàn hệ thống
        {
          courseId: { $in: registeredCourseIds }, // Thông báo liên quan đến các khóa học đã đăng ký
          type: 'course-notification',
        },
      ];
      console.log(role === '2');
      // Thêm điều kiện dựa vào role
      if (role === '1') {
        conditions.push({ role: 1 });
      } else if (role === '2') {
        conditions.push({ role: 2 });
      }
      console.log(conditions);
      // Tìm thông báo
      const notifications = await Notification.find({
        $or: conditions,
      }).sort({ createdAt: -1 }); // Sắp xếp từ mới nhất đến cũ nhất

      res.status(200).json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi lấy thông báo', error: err.message });
    }
  },

  getNotificationsBySenderId: async (req, res) => {
    try {
      const { senderId } = req.params;

      // Tìm thông báo với senderId và type === "system"
      const notifications = await Notification.find({
        $and: [{ senderId }, { type: 'system' }],
      }).sort({ createdAt: -1 }); // Sắp xếp từ mới nhất đến cũ nhất

      res.status(200).json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving notifications', error: err });
    }
  },

  getNotificationById: async (req, res) => {
    try {
      const { notifyId } = req.params;

      const notification = await Notification.findById(notifyId);

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.status(200).json(notification);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving notification', error: err });
    }
  },

  updateNotify: async (req, res) => {
    try {
      const { notifyId } = req.params;
      const updateData = req.body;

      // Tìm và cập nhật thông báo dựa trên notificationId
      const updatedNotification = await Notification.findByIdAndUpdate(
        notifyId,
        updateData,
        { new: true }, // Trả về thông báo đã cập nhật
      );

      if (!updatedNotification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.status(200).json({
        message: 'Notification updated successfully',
        data: updatedNotification,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating notification', error: err });
    }
  },

  updateNotificationsToRead: async (req, res) => {
    try {
      const { receiverId, role } = req.params;

      // Tìm user theo receiverId
      const user = await User.findById(receiverId).select('registeredCourses');
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại.' });
      }

      // Lấy danh sách courseId từ registeredCourses
      const registeredCourseIds = user.registeredCourses.map(course => course.courseId);

      // Điều kiện truy vấn thông báo
      const conditions = [
        { receiverId }, // Thông báo dành riêng cho người dùng
        { isGlobal: true }, // Thông báo toàn hệ thống
        { courseId: { $in: registeredCourseIds } }, // Thông báo liên quan đến khóa học đã đăng ký
      ];

      // Thêm điều kiện dựa vào role
      if (role === '1') {
        conditions.push({ role: 1 });
      } else if (role === '2') {
        conditions.push({ role: 2 });
      }

      // Cập nhật thông báo chưa đọc
      await Notification.updateMany(
        { $or: conditions, readBy: { $ne: receiverId } }, // Loại trừ thông báo đã được đọc bởi người dùng
        { $addToSet: { readBy: receiverId } }, // Thêm người dùng vào danh sách đã đọc
      );

      // Truy vấn lại danh sách thông báo
      const notifications = await Notification.find({ $or: conditions }).sort({ createdAt: -1 });

      res.status(200).json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating notifications', error: err });
    }
  },
  updateNotificationToRead: async (req, res) => {
    try {
      const { receiverId, notifyId } = req.params;

      // Cập nhật chỉ cho người dùng hiện tại và thông báo được chỉ định
      const notification = await Notification.findByIdAndUpdate(
        notifyId,
        { $addToSet: { readBy: receiverId } }, // Thêm người dùng vào danh sách đã đọc
        { new: true }, // Trả về bản ghi sau khi cập nhật
      );

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.status(200).json(notification);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating notification', error: err });
    }
  },

  deleteNotify: async (req, res) => {
    try {
      const { notifyId } = req.params;

      // Tìm và xóa thông báo dựa trên notificationId
      const deletedNotification = await Notification.findByIdAndDelete(notifyId);

      if (!deletedNotification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.status(200).json({
        message: 'Notification deleted successfully',
        data: deletedNotification,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting notification', error: err });
    }
  },

  searchNotifyByUser: async (req, res) => {
    try {
      const { field, q, senderId } = req.query; // Lấy field, q, senderId từ query string

      // Kiểm tra xem có tham số query không
      if (!q) {
        return res.status(400).json({ message: 'Query parameter is required' });
      }

      // Kiểm tra xem có field hợp lệ không (ví dụ: tittle hoặc des)
      if (!['tittle', 'des'].includes(field)) {
        return res.status(400).json({ message: 'Invalid field parameter' });
      }

      // Tìm kiếm thông báo dựa vào senderId, trường field và từ khóa query
      const notifications = await Notification.find({
        senderId: senderId,
        [field]: { $regex: q, $options: 'i' }, // Tìm kiếm theo trường và giá trị tìm kiếm
      });

      res.status(200).json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error searching notifications', error: err });
    }
  },
};

module.exports = notifyController;
