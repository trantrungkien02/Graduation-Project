// const { mongooseToOject } = require('../../utils/mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
const unidecode = require('unidecode');
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
        userName: req.body.userName,
        name: req.body.name,
        tittle: req.body.tittle,
        require: req.body.require,
        result: req.body.result,
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
      // Tìm các khóa học có isPublic là true
      const courses = await Course.find({ isPublic: true });
      res.status(200).json(courses);
    } catch (err) {
      console.error(err); // Log lỗi để tiện debug
      res.status(500).json({ message: 'Lỗi khi lấy danh sách khóa học', error: err });
    }
  },
  getAllCoursesPrivate: async (req, res) => {
    try {
      // Tìm các khóa học có isPublic là true
      const courses = await Course.find({ isPublic: false });
      res.status(200).json(courses);
    } catch (err) {
      console.error(err); // Log lỗi để tiện debug
      res.status(500).json({ message: 'Lỗi khi lấy danh sách khóa học', error: err });
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
    const { field, q, userId } = req.query; // Lấy tham số userId từ query

    try {
      // Nếu không có query tìm kiếm, trả về tất cả khóa học của người dùng
      if (!q) {
        const courses = await Course.find({ userId: userId }); // Lọc khóa học theo userId
        return res.status(200).json(courses);
      }

      // Tìm kiếm theo trường cụ thể trong các khóa học của người dùng
      const courses = await Course.find({
        userId: userId, // Lọc theo userId
        [field]: { $regex: q, $options: 'i' }, // Tìm kiếm theo trường và giá trị tìm kiếm
      });

      return res.status(200).json(courses);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  searchCoursesForAll: async (req, res) => {
    const { q } = req.query; // Lấy tham số tìm kiếm từ query

    try {
      // Nếu không có query tìm kiếm, trả về tất cả các khóa học
      if (!q) {
        const courses = await Course.find({ isPublic: true }); // Trả về tất cả các khóa học
        return res.status(200).json(courses);
      }

      // Tìm kiếm mặc định theo name và des
      const courses = await Course.find({
        isPublic: true,
        $or: [{ name: { $regex: q, $options: 'i' } }, { tittle: { $regex: q, $options: 'i' } }],
      });

      return res.status(200).json(courses);
    } catch (err) {
      console.error('Error searching courses:', err);
      res.status(500).json({ message: 'Error searching courses', error: err });
    }
  },
  searchCoursesForAdmin: async (req, res) => {
    const { q, field } = req.query; // Lấy tham số tìm kiếm từ query

    try {
      // Nếu không có query tìm kiếm, trả về tất cả các khóa học (isPublic: false)
      if (!q) {
        const courses = await Course.find({ isPublic: false }); // Trả về tất cả các khóa học
        return res.status(200).json(courses);
      }

      // Kiểm tra nếu field không được chỉ định hoặc không hợp lệ
      if (!field || typeof field !== 'string') {
        return res.status(400).json({ message: 'Invalid field parameter' });
      }

      // Tìm kiếm theo trường và giá trị
      const courses = await Course.find({
        isPublic: false, // Lọc theo isPublic: false
        [field]: { $regex: q, $options: 'i' }, // Tìm kiếm theo trường field và giá trị q
      });

      return res.status(200).json(courses);
    } catch (err) {
      console.error('Error searching courses:', err);
      res.status(500).json({ message: 'Error searching courses', error: err });
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

  updateCourseAddUser: async (req, res) => {
    const { id } = req.params; // Lấy id khóa học từ params
    const userData = req.body; // Lấy thông tin người dùng từ body

    try {
      // Kiểm tra xem thông tin người dùng có tồn tại không
      console.log(req.body);
      if (!userData || !userData.userId) {
        return res.status(400).json({ message: 'Thông tin người dùng không hợp lệ' });
      }

      // Tìm khóa học và cập nhật mảng registeredUsers
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            // Chỉ thêm người dùng nếu chưa tồn tại
            registeredUsers: userData,
          },
          $inc: { registrations: 1 }, // Tăng số lượng đăng ký
        },
        { new: true, runValidators: true },
      );

      // Nếu không tìm thấy khóa học, trả về lỗi
      if (!updatedCourse) {
        return res.status(404).json({ message: 'Khóa học không tồn tại' });
      }

      // Trả về khóa học đã cập nhật
      return res.status(200).json(updatedCourse);
    } catch (err) {
      console.error('Error updating course:', err);
      return res.status(500).json(err);
    }
  },

  incrementRegistration: async (req, res) => {
    const courseId = req.params.id;
    const { userId, courseDetail } = req.body; // Lấy courseDetail từ yêu cầu

    try {
      // Tăng số lượng đăng ký của khóa học lên 1
      const course = await Course.findById(courseId);

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
  updateLessonCompleted: async (req, res) => {
    const { courseId, userId } = req.params; // Lấy courseId và userId từ params

    try {
      // Tìm khóa học theo courseId
      const course = await Course.findById(courseId);

      // Nếu không tìm thấy khóa học
      if (!course) {
        return res.status(404).json({ message: 'Khóa học không tồn tại' });
      }

      // Tìm user trong mảng registeredUsers
      const user = course.registeredUsers.find(user => user.userId == userId);

      // Nếu không tìm thấy user
      if (!user) {
        return res.status(404).json({ message: 'User không tồn tại trong khóa học này' });
      }

      // Tăng lessonCompleted lên 1
      user.lessonCompleted += 1;

      // Lưu lại khóa học sau khi cập nhật
      await course.save();

      // Trả về thông tin khóa học sau khi cập nhật
      return res.status(200).json(course);
    } catch (err) {
      return res.status(500).json({ message: 'Đã xảy ra lỗi', error: err });
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
