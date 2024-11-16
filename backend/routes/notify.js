const notifyController = require('../controllers/notifyController');

const router = require('express').Router();

//REGISTER
router.post('/create', notifyController.createNotification);

router.get('/getnotify/:receiverId/:role', notifyController.getNotificationsByReceiverId);

router.put('/markallread/:receiverId/:role', notifyController.updateNotificationsToRead);

module.exports = router;
