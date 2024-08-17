const express = require('express');
const router = express.Router();
const disponibilidadCuidadorController = require('../controllers/disponibilidadCuidadorController.js');

router.get('/', disponibilidadCuidadorController.getDisponibilidad);
router.post('/', disponibilidadCuidadorController.createDisponibilidad);
router.delete('/:id', disponibilidadCuidadorController.deleteDisponibilidad);

module.exports = router; 