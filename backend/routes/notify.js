const notifyController = require('../controllers/notifyController');

const router = require('express').Router();

//REGISTER
router.post('/create', notifyController.createNotification);

router.post('/createforcourse', notifyController.createNotificationForCourse);

router.get('/getnotify/:receiverId/:role', notifyController.getNotificationsByReceiverId);

router.get('/getnotifybyid/:notifyId', notifyController.getNotificationById);

router.get('/getnotifybysenderid/:senderId', notifyController.getNotificationsBySenderId);

router.get('/searchnotify', notifyController.searchNotifyByUser);

router.put('/markallread/:receiverId/:role', notifyController.updateNotificationsToRead);

router.put('/markoneread/:receiverId/:notifyId', notifyController.updateNotificationToRead);

router.put('/updatenotify/:notifyId', notifyController.updateNotify);

router.delete('/deletenotify/:notifyId', notifyController.deleteNotify);

module.exports = router;
