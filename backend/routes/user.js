const userController = require('../controllers/userController');
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndUserAuthorization } = require('../controllers/verifyToken');

const router = require('express').Router();
//GET ALL USERS
router.get('/', verifyToken, userController.getAllUsers);

router.get('/getuserbyid/:id', verifyToken, userController.getUserById);

router.get('/search', verifyToken, userController.searchUsers);

router.put('/update-user', userController.updateUser);

//DELETE USER
router.delete('/:id', verifyTokenAndUserAuthorization, userController.deleteUser);

module.exports = router;
