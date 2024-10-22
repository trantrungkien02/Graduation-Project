const lessonController = require('../controllers/lessonController');

const router = require('express').Router();

//REGISTER
router.post('/register', lessonController.registerLesson);

router.get('/getalllessons', lessonController.getAllLessons);
router.get('/getlessonsbycourseid/:courseId', lessonController.getAllLessonsByCourseId);
router.get('/getlessonbyid/:id', lessonController.getLessonById);

router.put('/update/:id', lessonController.updateLesson);

router.delete('/delete/:id', lessonController.deleteLesson);

module.exports = router;
