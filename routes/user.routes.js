
const express =  require('express');
const router  = express.Router();
const auth = require('../middleware/auth')


const userController = require('../controllers/user.controller');

router.get('/', userController.getAllUsers);
router.post('/', auth.isAuth, userController.createUser);
router.put('/:id', auth.isAuth, userController.updateUser);
router.delete('/:id', auth.isAuth, userController.deleteUser);



module.exports = router;

