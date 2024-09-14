const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js');

router.get('/', usuarioController.getUsers);
router.post('/', usuarioController.createNewUser);
router.post('/login', usuarioController.login);
router.delete('/delete/:id', usuarioController.deleteUser);
router.put('/update/:id', usuarioController.editUser);
//router.put('/updatePassword/:id', usuarioController.editPassword);
router.get('/cuidadorHabilitado/', usuarioController.getCuidadorHabilitado);
router.get('/cuidadorNoHabilitado/', usuarioController.getCuidadorNoHabilitado);
router.get('/:id', usuarioController.getOneUser);

module.exports = router;