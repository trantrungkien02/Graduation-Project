const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      // Check if username already exists
      const existingUsername = await User.findOne({ username: req.body.username });
      if (existingUsername) {
        return res.status(404).json('Username already exists');
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(404).json('Email already exists');
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        role: req.body.role,
      });

      // Save user to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  generateAccessToken: user => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: '365d' },
    );
  },

  generateRefreshToken: user => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: '365d' },
    );
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      // Tìm người dùng dựa trên email hoặc username
      const user = await User.findOne({
        $or: [
          { username: req.body.usernameOrEmail }, // Nếu đăng nhập bằng username
          { email: req.body.usernameOrEmail },
        ],
      });

      // Nếu không tìm thấy người dùng
      if (!user) {
        return res.status(404).json('Incorrect username or email');
      }

      // Kiểm tra mật khẩu
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(404).json('Incorrect password');
      }

      if (user && validPassword) {
        // Tạo access token
        const accessToken = authController.generateAccessToken(user);
        // Tạo refresh token
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        // Lưu refresh token trong cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          path: '/',
        });
        console.log('Cookie set:', res.cookies);
        // Loại bỏ mật khẩu trước khi trả về
        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  requestRefreshToken: async (req, res) => {
    //Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    console.log(req.cookies, refreshToken);
    if (!refreshToken) return res.status(401).json("You're not authenticated ok");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json('Refresh token is not valid');
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter(token => token !== refreshToken);
      //Create new accesstoken, refresh token
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  //LOG OUT
  userLogout: async (req, res) => {
    res.clearCookie('refreshToken');
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
    res.status(200).json('Logged out !');
  },
};

module.exports = authController;
