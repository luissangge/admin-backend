const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const hospitalController = require('../controllers/hospitals.controller');


//Get all hospitals
router.get('/', hospitalController.getAll);
router.post('/',  auth.isAuth, hospitalController.createHospital);
router.put('/:id', auth.isAuth, hospitalController.updateHospital);
router.delete('/:id', auth.isAuth, hospitalController.deleteHospital);


module.exports = router