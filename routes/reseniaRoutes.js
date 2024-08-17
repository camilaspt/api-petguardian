const express = require('express');
const router = express.Router();
const reseniaController = require('../controllers/reseniaController.js');

router.get('/', reseniaController.getResenias);
router.post('/', reseniaController.createResenia);
router.delete('/:id', reseniaController.deleteResenia);
router.get('/:id', reseniaController.getOneResenia);

module.exports = router;