const Lesson = require('../models/Lesson');
const Notification = require('../models/Notification');
const Course = require('../models/Course');

async function getVideoDuration(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Kiểm tra xem data.items có tồn tại và là một mảng
    if (data && Array.isArray(data.items)) {
      if (data.items.length > 0) {
        const duration = data.items[0].contentDetails.duration;
        console.log(`Thời lượng video: ${duration}`);
        return duration;
      } else {
        console.log('Không tìm thấy video với ID đã cho.');
        return null; // Hoặc xử lý theo cách khác nếu không tìm thấy video
      }
    } else {
      console.log('Phản hồi không hợp lệ từ API:', data);
      console.log(process.env.YOUTUBE_API_KEY);
      return null; // Hoặc xử lý lỗi
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin video:', error);
    return null; // Hoặc xử lý lỗi
  }
}

function convertDuration(duration) {
  if (duration != null) {
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const hours = matches[1] ? matches[1].padStart(2, '0') : '00';
    const minutes = matches[2] ? matches[2].padStart(2, '0') : '00';
    const seconds = matches[3] ? matches[3].padStart(2, '0') : '00';

    if (hours === '00') {
      return `${minutes}:${seconds}`; // Đảm bảo phút luôn là 2 chữ số
    } else {
      return `${hours}:${minutes}:${seconds}`;
    }
  } else {
    return null;
  }
}

const lessonController = {
  registerLesson: async (req, res) => {
    try {
      const { name, courseId, videoId, discuss, userId, userName } = req.body;
      // Check if both lesson name and courseId already exist together
      const existingLesson = await Lesson.findOne({
        name: name,
        courseId: courseId,
      });

      if (existingLesson) {
        return res.status(400).json('Lesson name and courseId combination already exists');
      }

      // Get video duration
      const duration = await getVideoDuration(videoId);

      // Create new lesson
      const newLesson = new Lesson({
        name: name,
        courseId: courseId,
        videoId: videoId,
        discuss: discuss,
        duration: convertDuration(duration), // Lưu thời lượng video
      });
      const lesson = await newLesson.save();

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học.' });
      }

      // Tạo thông báo chung cho tất cả người dùng đã đăng ký khóa học
      const notification = new Notification({
        senderId: userId, // ID giảng viên
        senderName: userName, // Tên giảng viên
        receiverId: '', // Rỗng vì thông báo dành cho nhiều người
        tittle: `Bài giảng mới trong khóa học ${course.name}`,
        des: `Bài giảng "${name}" đã được thêm vào khóa học mà bạn đã đăng ký.`,
        courseId: course.slug,
        lessonId: lesson._id,
        type: 'lesson', // Loại thông báo là bài giảng
      });

      await notification.save();
      // Save lesson to DB
      res.status(200).json(lesson);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  registerPractice: async (req, res) => {
    try {
      const { name, courseId, quesList, userId, userName } = req.body;

      // Check if both lesson name and courseId already exist together
      const existingLesson = await Lesson.findOne({
        name: name,
        courseId: courseId,
      });

      if (existingLesson) {
        return res.status(400).json('Practice name and courseId combination already exists');
      }

      // Create new practice lesson
      const newPractice = new Lesson({
        name: name,
        courseId: courseId,
        quesList: quesList, // Danh sách câu hỏi
        type: 'question', // Gán loại bài học là bài thực hành
      });

      const practice = await newPractice.save();

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học.' });
      }

      // Tạo thông báo chung cho tất cả người dùng đã đăng ký khóa học
      const notification = new Notification({
        senderId: userId, // ID giảng viên
        senderName: userName, // Tên giảng viên
        receiverId: '', // Rỗng vì thông báo dành cho nhiều người
        tittle: `Bài thực hành mới trong khóa học ${course.name}`,
        des: `Bài thực hành "${name}" đã được thêm vào khóa học mà bạn đã đăng ký.`,
        courseId: course.slug,
        lessonId: practice._id,
        type: 'practice', // Loại thông báo là bài thực hành
      });

      await notification.save();

      res.status(200).json(practice);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  getAllLessons: async (req, res) => {
    try {
      const lessons = await Lesson.find();
      res.status(200).json(lessons);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllLessonsByCourseId: async (req, res) => {
    const courseId = req.params.courseId; // Lấy courseId từ tham số trong URL
    console.log(courseId);
    try {
      // Tìm tất cả các bài học theo courseId (giả định có trường courseId trong Lesson)
      const lessons = await Lesson.find({ courseId: courseId });

      // Nếu không có bài học nào, trả về thông báo thích hợp
      if (lessons.length === 0) {
        return res.status(201).json({ message: 'Không tìm thấy bài học nào cho khóa học này.' });
      }

      res.status(200).json(lessons);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getLessonById: async (req, res) => {
    const { id } = req.params; // Lấy ID từ params

    try {
      // Tìm bài học theo ID
      const lesson = await Lesson.findById(id);

      // Nếu không tìm thấy bài học, trả về lỗi
      if (!lesson) {
        return res.status(404).json({ message: 'Bài học không tồn tại' });
      }

      // Trả về thông tin bài học
      return res.status(200).json(lesson);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Đã xảy ra lỗi', error: err });
    }
  },
  updateLesson: async (req, res) => {
    const { id } = req.params; // Lấy id từ params
    const updatedData = req.body; // Lấy dữ liệu cập nhật từ body

    try {
      // Kiểm tra nếu có videoId mới trong dữ liệu cập nhật
      if (updatedData.videoId) {
        // Lấy lại thời lượng video
        const newDuration = await getVideoDuration(updatedData.videoId);
        updatedData.duration = convertDuration(newDuration); // Cập nhật lại duration
      }

      // Tìm bài học theo id và cập nhật thông tin
      const updatedLesson = await Lesson.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

      // Nếu không tìm thấy bài học, trả về lỗi
      if (!updatedLesson) {
        return res.status(404).json({ message: 'Bài học không tồn tại' });
      }

      // Trả về bài học đã cập nhật
      return res.status(200).json(updatedLesson);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  updatePractice: async (req, res) => {
    const { id } = req.params; // Lấy id từ params
    const updatedData = req.body; // Lấy dữ liệu cập nhật từ body

    try {
      // Tìm bài thực hành theo id và cập nhật thông tin
      const updatedPractice = await Practice.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });

      // Nếu không tìm thấy bài thực hành, trả về lỗi
      if (!updatedPractice) {
        return res.status(404).json({ message: 'Bài thực hành không tồn tại' });
      }

      // Trả về bài thực hành đã cập nhật
      return res.status(200).json(updatedPractice);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Lỗi server', error: err });
    }
  },

  deleteLesson: async (req, res) => {
    const lessonId = req.params.id;

    try {
      // Tìm bài học theo ID và xóa
      const deletedLesson = await Lesson.findByIdAndDelete(lessonId);

      if (!deletedLesson) {
        return res.status(404).json({ message: 'Bài học không tồn tại' });
      }

      return res.status(200).json({ message: 'Bài học đã được xóa thành công', lesson: deletedLesson });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi khi xóa bài học', error });
    }
  },
};
module.exports = lessonController;
