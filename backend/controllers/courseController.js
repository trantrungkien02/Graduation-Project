// const { mongooseToOject } = require('../../utils/mongoose');
const Course = require('../models/Course');
const courseController = {
  // DANG KHOA HOC
  registerCourse: async (req, res) => {
    try {
      // Check if course name already exists
      const existingCourse = await Course.findOne({ name: req.body.name });
      if (existingCourse) {
        return res.status(400).json('Course name already exists');
      }

      // Create new course
      const newCourse = new Course({
        userId: req.body.userId,
        name: req.body.name,
        des: req.body.des,
        image: req.body.image,
        videoId: req.body.videoId,
        level: req.body.level,
        price: req.body.price,
      });

      // Save course to DB
      const course = await newCourse.save();
      res.status(200).json(course);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  getAllCourses: async (req, res) => {
    try {
      const courses = await Course.find();
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getCourseBySlug: async (req, res) => {
    try {
      // Lấy slug từ params của request
      const { slug } = req.params;
      console.log({ slug });
      // Tìm khóa học dựa trên slug
      const course = await Course.findOne({ slug });

      // Nếu không tìm thấy khóa học, trả về lỗi 404
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Trả về dữ liệu khóa học nếu tìm thấy
      res.status(200).json(course);
    } catch (err) {
      // Xử lý lỗi
      res.status(500).json(err);
    }
  },
};

module.exports = courseController;
