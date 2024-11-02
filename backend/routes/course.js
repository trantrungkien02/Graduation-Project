const coursesController = require('../controllers/courseController');

const router = require('express').Router();

//REGISTER
router.post('/register', coursesController.registerCourse);

router.get('/getallcourses', coursesController.getAllCourses);
router.get('/getallcoursesbyid/:userId', coursesController.getAllCoursesByIdUser);
router.get('/getcoursebyid/:id', coursesController.getCoursesById);

router.get('/detail/:slug', coursesController.getCourseBySlug);

router.get('/search', coursesController.searchCourses);

router.post('/:id/register', coursesController.incrementRegistration);

router.put('/update/:id', coursesController.updateCourse);

router.delete('/delete/:id', coursesController.deleteCourse);

module.exports = router;
