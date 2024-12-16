const LessonNote = require('../models/LessonNote');

const lessonNoteController = {
  getAllNotes: async (req, res) => {
    try {
      // Truy vấn tất cả ghi chú và sắp xếp theo `createdAt` từ mới nhất đến cũ nhất
      const notes = await LessonNote.find().sort({ createdAt: -1 });

      if (!notes || notes.length === 0) {
        return res.status(404).json({ message: 'No notes found' });
      }

      res.status(200).json(notes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving notes', error: err });
    }
  },
  getNoteByCourseIdAndUserId: async (req, res) => {
    try {
      const { courseId, userId } = req.params; // Lấy courseId và userId từ params
      const notes = await LessonNote.find({ courseId, userId }).sort({ createdAt: -1 }); // Sắp xếp các ghi chú từ mới nhất đến cũ nhất

      res.status(200).json(notes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving notes', error: err });
    }
  },
  createNote: async (req, res) => {
    try {
      const { userId, courseId, lessonId, lessonName, text } = req.body;

      const newNote = new LessonNote({
        userId,
        courseId,
        lessonId,
        lessonName,
        text,
      });

      const savedNote = await newNote.save();
      res.status(200).json(savedNote);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating note', error: err });
    }
  },

  updateNote: async (req, res) => {
    try {
      const { id } = req.params; // ID của ghi chú cần cập nhật
      const updateData = req.body; // Dữ liệu mới được gửi từ client

      const updatedNote = await LessonNote.findByIdAndUpdate(id, updateData, {
        new: true, // Trả về đối tượng đã được cập nhật
        runValidators: true, // Chạy các validator để đảm bảo dữ liệu hợp lệ
      });

      if (!updatedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }

      res.status(200).json(updatedNote);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating note', error: err });
    }
  },

  deleteNote: async (req, res) => {
    try {
      const { id } = req.params; // ID của ghi chú cần xóa

      const deletedNote = await LessonNote.findByIdAndDelete(id);

      if (!deletedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }

      res.status(200).json({ message: 'Note deleted successfully', deletedNote });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting note', error: err });
    }
  },
};

module.exports = lessonNoteController;
