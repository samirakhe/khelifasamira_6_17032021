const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const user = require('../models/user');


//on crée deux routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;