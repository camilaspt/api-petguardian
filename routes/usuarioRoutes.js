const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js');

router.get('/', usuarioController.getUsers);
router.post('/', usuarioController.createNewUser);
router.post('/login', usuarioController.login);
router.delete('/delete/:id', usuarioController.deleteUser);
// router.get('/update/:id', usuarioController.edit);

module.exports = router;