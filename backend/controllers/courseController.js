// const { mongooseToOject } = require('../../utils/mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
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
  getAllCoursesByIdUser: async (req, res) => {
    const userId = req.params.userId; // Lấy userId từ tham số trong URL
    console.log(userId);
    try {
      // Tìm tất cả các khóa học mà người dùng đã đăng ký (giả định có trường userId trong Course)
      const courses = await Course.find({ userId: userId });

      // Nếu không có khóa học nào, trả về thông báo thích hợp
      if (courses.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học nào cho người dùng này.' });
      }

      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getCourseBySlug: async (req, res) => {
    try {
      // Lấy slug từ params của request
      const { slug } = req.params;

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
  getCoursesById: async (req, res) => {
    const { id } = req.params; // Lấy ID từ params

    try {
      // Tìm khóa học theo ID
      const course = await Course.findById(id);

      // Nếu không tìm thấy khóa học, trả về lỗi
      if (!course) {
        return res.status(404).json({ message: 'Khóa học không tồn tại' });
      }

      // Trả về thông tin khóa học
      return res.status(200).json(course);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Đã xảy ra lỗi', error: err });
    }
  },
  searchCourses: async (req, res) => {
    const { field, q } = req.query;

    try {
      // Nếu không có query tìm kiếm, trả về tất cả khóa học
      if (!q) {
        const courses = await Course.find();
        return res.status(200).json(courses);
      }

      // Tìm kiếm theo trường cụ thể
      const courses = await Course.find({ [field]: { $regex: q, $options: 'i' } });
      return res.status(200).json(courses);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateCourse: async (req, res) => {
    const { id } = req.params; // Lấy id từ params
    const updatedData = req.body; // Lấy dữ liệu cập nhật từ body
    console.log(id, updatedData);
    try {
      // Tìm khóa học theo id và cập nhật thông tin
      const updatedCourse = await Course.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

      // Nếu không tìm thấy khóa học, trả về lỗi
      if (!updatedCourse) {
        return res.status(404).json({ message: 'Khóa học không tồn tại' });
      }

      // Trả về khóa học đã cập nhật
      return res.status(200).json(updatedCourse);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  incrementRegistration: async (req, res) => {
    const courseId = req.params.id;
    const { userId, courseDetail } = req.body; // Lấy courseDetail từ yêu cầu

    try {
      // Tăng số lượng đăng ký của khóa học lên 1
      const course = await Course.findByIdAndUpdate(courseId, { $inc: { registrations: 1 } }, { new: true });

      if (course) {
        // Thêm khóa học với chi tiết vào danh sách đã đăng ký của user
        await User.findByIdAndUpdate(userId, {
          $push: {
            registeredCourses: {
              courseId: courseDetail._id,
              courseName: courseDetail.name,
              courseAvt: courseDetail.image,
              courseSlug: courseDetail.slug,
              lessonsCompleted: 0,
            },
          },
        });

        res.status(200).json({
          message: 'Đăng ký khóa học thành công!',
          course,
        });
      } else {
        res.status(404).json({ message: 'Không tìm thấy khóa học' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi đăng ký khóa học', error });
    }
  },
  deleteCourse: async (req, res) => {
    const courseId = req.params.id;

    try {
      // Tìm khóa học theo ID và xóa
      const deletedCourse = await Course.findByIdAndDelete(courseId);

      if (!deletedCourse) {
        return res.status(404).json({ message: 'Khóa học không tồn tại' });
      }

      return res.status(200).json({ message: 'Khóa học đã được xóa thành công', course: deletedCourse });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi khi xóa khóa học', error });
    }
  },
};

module.exports = courseController;
