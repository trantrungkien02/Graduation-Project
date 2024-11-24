const bannerController = require('../controllers/bannerController');

const router = require('express').Router();

router.get('/getallbanner', bannerController.getAllImages);

router.post('/create', bannerController.createImage);

router.put('/update/:id', bannerController.updateImage);

router.delete('/delete/:id', bannerController.deleteImage);

module.exports = router;
