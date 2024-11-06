const User = require('../models/User');
const bcrypt = require('bcrypt');
const userController = {
  //GET ALL USERS
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
