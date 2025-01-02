const User = require('../models/User');
const bcrypt = require('bcrypt');
const userController = {
  updateUserInfo: async (req, res) => {
    try {
      // Find user by username or email
      const user = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });

      if (!user) {
        return res.status(404).json('User not found');
      }

      // Update specific fields in info
      const fieldsToUpdate = ['fullName', 'bio', 'address', 'courseCount', 'studentCount', 'avatar', 'headerImage', 'github', 'facebook', 'tiktok'];

      // Loop through the fields and update only the ones provided
      fieldsToUpdate.forEach(field => {
        if (req.body[field] !== undefined) {
          user.info = user.info || {}; // Ensure info object exists
          user.info[field] = req.body[field];
        }
      });

      // Save the updated user
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getUserInfo: async (req, res) => {
    try {
      // Tìm user bằng username hoặc email
      const user = await User.findOne({
        $or: [{ username: req.query.username }, { email: req.query.email }],
      });

      if (!user) {
        return res.status(404).json('User not found');
      }

      // Lấy thông tin info
      const userInfo = user.info;

      if (!userInfo) {
        return res.status(404).json('User info not found');
      }

      // Trả về thông tin info
      res.status(200).json(userInfo);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id; // Lấy userId từ tham số URL
      const user = await User.findById(userId); // Tìm người dùng theo userId

      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' }); // Nếu không tìm thấy người dùng
      }

      res.status(200).json(user); // Trả về thông tin người dùng
    } catch (err) {
      res.status(500).json(err); // Xử lý lỗi
    }
  },
  getUserBySlug: async (req, res) => {
    try {
      const userSlug = req.params.slug; // Lấy slug từ tham số URL
      console.log('day laf slug:', userSlug);
      const user = await User.findOne({ slug: userSlug }); // Tìm người dùng theo slug

      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' }); // Nếu không tìm thấy người dùng
      }
      console.log(user);
      res.status(200).json(user); // Trả về thông tin người dùng
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err }); // Xử lý lỗi
    }
  },

  searchUsers: async (req, res) => {
    const { field, q } = req.query;

    try {
      // Nếu không có query tìm kiếm, trả về tất cả người dùng
      if (!q) {
        const users = await User.find();
        return res.status(200).json(users);
      }

      // Tìm kiếm theo trường cụ thể
      const users = await User.find({ [field]: { $regex: q, $options: 'i' } }); // Tìm kiếm không phân biệt chữ hoa chữ thường
      return res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  searchTeacher: async (req, res) => {
    const { q } = req.query;

    try {
      // Nếu không có query tìm kiếm, trả về tất cả giáo viên
      if (!q) {
        const teachers = await User.find({ role: '2' });
        return res.status(200).json(teachers);
      }

      // Tìm kiếm theo username hoặc fullName trong info
      const teachers = await User.find({
        role: '2',
        $or: [
          { username: { $regex: q, $options: 'i' } }, // Tìm kiếm theo username
          { 'info.fullName': { $regex: q, $options: 'i' } },
        ],
      });
      return res.status(200).json(teachers);
    } catch (err) {
      console.error('Error searching teachers:', err);
      res.status(500).json({ message: 'Error searching teachers', error: err });
    }
  },

  updateUser: async (req, res) => {
    try {
      // Tìm người dùng dựa trên email
      const user = await User.findOne({ email: req.body.email });

      // Nếu không tìm thấy người dùng
      if (!user) {
        return res.status(404).json('User not found');
      }

      // Kiểm tra nếu trường `username` có thay đổi
      if (req.body.username) {
        const usernameExists = await User.findOne({ username: req.body.username });
        if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
          return res.status(400).json('Username already in use');
        }
        user.username = req.body.username;
        user.isLimit = req.body.isLimit;
        user.registeredCourses = req.body.registeredCourses;
      }

      // Kiểm tra mật khẩu cũ nếu nó được gửi lên
      if (req.body.oldpassword) {
        // So sánh mật khẩu cũ với mật khẩu hiện tại
        const validOldPassword = await bcrypt.compare(req.body.oldpassword, user.password);
        if (!validOldPassword) {
          return res.status(401).json('Incorrect old password');
        }

        // Nếu mật khẩu mới được gửi lên, cập nhật mật khẩu
        if (req.body.password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);
          user.password = hashedPassword;
        }
      }

      // Lưu lại thông tin người dùng đã cập nhật
      const updatedUser = await user.save();

      // Loại bỏ mật khẩu trước khi trả về thông tin
      const { password, ...others } = updatedUser._doc;

      // Trả về phản hồi thành công
      return res.status(200).json(others);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //DELETE USER
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Delete successfully');
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
