const express = require('express');
const {  signupUser,loginUser,logOutUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', signupUser);
router.post('/login', loginUser);
router.post('/logOutUser', logOutUser);


module.exports = router;
