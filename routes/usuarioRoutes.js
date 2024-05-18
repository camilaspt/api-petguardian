const router = require('express').Router();
const usuarioController = require('../controllers/usuarioController.js');

router.get('/', usuarioController.getUsers);
router.post('/new', usuarioController.createNewUser);
// router.get('/delete/:id', usuarioController.delete);
// router.get('/update/:id', usuarioController.edit);

module.exports = router;