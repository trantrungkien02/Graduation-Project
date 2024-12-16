const lessonNoteController = require('../controllers/lessonNoteController');

const router = require('express').Router();

router.get('/getallnotes', lessonNoteController.getAllNotes);

router.get('/getnotebyid/:courseId/:userId', lessonNoteController.getNoteByCourseIdAndUserId);

router.post('/create', lessonNoteController.createNote);

router.put('/update/:id', lessonNoteController.updateNote);

router.delete('/delete/:id', lessonNoteController.deleteNote);

module.exports = router;
