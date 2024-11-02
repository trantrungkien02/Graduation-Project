const authController = require('../controllers/authController');

const router = require('express').Router();
const { verifyToken } = require('../controllers/verifyToken');

//REGISTER
router.post('/register', authController.registerUser);

//REFRESH TOKEN
router.post('/refresh', authController.requestRefreshToken);
//LOG IN
router.post('/login', authController.loginUser);
//LOG IN GOOGLE
router.post('/login-google', authController.loginGoogle);
//LOG OUT
router.post('/logout', authController.userLogout);

module.exports = router;
