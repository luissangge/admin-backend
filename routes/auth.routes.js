const express = require('express')
const router = express.Router();

const loginController = require('../controllers/login.controller');



router.post('/', loginController.login);
router.post('/google', loginController.loginGoogle);






module.exports = router;