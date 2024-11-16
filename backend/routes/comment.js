const commentController = require('../controllers/commentController');

const router = require('express').Router();

//REGISTER
router.post('/create', commentController.createComment);

router.post('/addreply/:commentId', commentController.addReply);

router.get('/getcommentsbylessonid/:lessonId', commentController.getCommentsByLessonId);
router.get('/getcommentbyid/:commentId', commentController.getCommentById);

router.put('/update/:commentId', commentController.updateComment);

router.delete('/delete/:commentId', commentController.deleteComment);

router.put('/:commentId/updatereply/:replyId', commentController.updateReply);
router.delete('/:commentId/deletereply/:replyId', commentController.deleteReply);
router.get('/:commentId/getreplybyid/:replyId', commentController.getReplyById);

module.exports = router;
