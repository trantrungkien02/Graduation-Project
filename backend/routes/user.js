const userController = require('../controllers/userController');
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndUserAuthorization } = require('../controllers/verifyToken');

const router = require('express').Router();

router.get('/getinfo', userController.getUserInfo);

router.put('/updateinfo', userController.updateUserInfo);

router.get('/', verifyToken, userController.getAllUsers);

router.get('/getuserbyid/:id', verifyToken, userController.getUserById);

router.get('/getuserbyslug/:slug', verifyToken, userController.getUserBySlug);

router.get('/search', verifyToken, userController.searchUsers);

router.get('/searchteacher', verifyToken, userController.searchTeacher);

router.put('/update-user', userController.updateUser);

//DELETE USER
router.delete('/:id', verifyTokenAndUserAuthorization, userController.deleteUser);

module.exports = router;
