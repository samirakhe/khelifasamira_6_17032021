const express = require('express');
const Mongoose = require('mongoose');
const router = express.Router();
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceParser =  require('../middleware/sauceParser');
const sauceValidator = require('../middleware/sauce-validator');


router.post('/', auth, multer, sauceParser, sauceValidator(), sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/:id/like', auth, sauceCtrl.likedSauce);

module.exports = router;
