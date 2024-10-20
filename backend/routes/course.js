const coursesController = require('../controllers/courseController');

const router = require('express').Router();

//REGISTER
router.post('/register', coursesController.registerCourse);

router.get('/getallcourses', coursesController.getAllCourses);

router.get('/:slug', coursesController.getCourseBySlug);

module.exports = router;
