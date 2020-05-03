const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/upload.controller');


router.put('/:collection/:id', uploadController.upload)



module.exports = router;