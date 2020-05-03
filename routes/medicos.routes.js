const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const medicosController = require('../controllers/medicos.controller');


//Get All Medicos
router.get('/',   medicosController.getAll);
router.post('/', auth.isAuth,  medicosController.createMedico);
router.put('/:id', auth.isAuth,  medicosController.updateMedico);
router.delete('/:id', auth.isAuth,  medicosController.deleteMedico);




module.exports = router;