const Comment = require('../models/Comment');

const commentController = {
  // CREATE COMMENT
  createComment: async (req, res) => {
    try {
      const { userId, lessonId, text, avatarUrl, fullName } = req.body;

      const newComment = new Comment({
        userId,
        lessonId,
        text,
        avatarUrl,
        fullName,
      });

      const savedComment = await newComment.save();
      res.status(201).json(savedComment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating comment', error: err });
    }
  },

  // GET ALL COMMENTS FOR A LESSON
  getCommentsByLessonId: async (req, res) => {
    try {
      const { lessonId } = req.params;
      const comments = await Comment.find({ lessonId });
      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving comments', error: err });
    }
  },
  getCommentById: async (req, res) => {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      res.status(200).json(comment.text);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving comment', error: err });
    }
  },

  // UPDATE COMMENT
  updateComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { text } = req.body;

      const updatedComment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });

      if (!updatedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      res.status(200).json(updatedComment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating comment', error: err });
    }
  },

  // DELETE COMMENT
  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const deletedComment = await Comment.findByIdAndDelete(commentId);

      if (!deletedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting comment', error: err });
    }
  },

  // ADD REPLY TO A COMMENT
  addReply: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId, text, avatarUrl, fullName } = req.body;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      // Thêm comId vào trong reply
      comment.replies.push({
        userId,
        text,
        avatarUrl,
        fullName,
        timestamp: new Date(),
      });

      const updatedComment = await comment.save();
      res.status(201).json(updatedComment);
    } catch (err) {
      res.status(500).json({ message: 'Error adding reply', error: err });
    }
  },
  getReplyById: async (req, res) => {
    try {
      const { commentId, replyId } = req.params; // Nhận commentId và replyId từ params

      const comment = await Comment.findById(commentId); // Tìm bình luận theo commentId

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      // Tìm phản hồi theo replyId trong mảng replies
      const reply = comment.replies.id(replyId); // Tìm phản hồi theo replyId

      if (!reply) {
        return res.status(404).json({ message: 'Reply not found' });
      }

      res.status(200).json(reply.text); // Trả về phản hồi
    } catch (err) {
      res.status(500).json({ message: 'Error getting reply', error: err });
    }
  },
  updateReply: async (req, res) => {
    try {
      const { commentId, replyId } = req.params; // Nhận commentId và replyId từ params
      const { text } = req.body; // Nội dung mới của phản hồi

      const comment = await Comment.findById(commentId); // Tìm bình luận theo commentId

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      // Tìm phản hồi cần cập nhật trong mảng replies
      const reply = comment.replies.id(replyId); // Tìm phản hồi theo replyId

      if (!reply) {
        return res.status(404).json({ message: 'Reply not found' });
      }

      // Cập nhật nội dung phản hồi
      reply.text = text;
      const updatedComment = await comment.save(); // Lưu lại thay đổi

      res.status(200).json(updatedComment);
    } catch (err) {
      res.status(500).json({ message: 'Error updating reply', error: err });
    }
  },
  deleteReply: async (req, res) => {
    try {
      const { commentId, replyId } = req.params; // Lấy commentId và replyId từ params

      const comment = await Comment.findById(commentId); // Tìm comment bằng commentId
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      // Lọc replyId khỏi mảng replies
      const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);

      if (replyIndex === -1) {
        return res.status(404).json({ message: 'Reply not found' });
      }

      // Xóa reply khỏi mảng replies
      comment.replies.splice(replyIndex, 1);

      const updatedComment = await comment.save(); // Lưu thay đổi
      res.status(200).json(updatedComment);
    } catch (err) {
      console.error('Error deleting reply:', err); // Ghi log lỗi để kiểm tra chi tiết
      res.status(500).json({ message: 'Error deleting reply', error: err });
    }
  },
};

module.exports = commentController;
