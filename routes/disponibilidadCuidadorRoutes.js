const express = require('express');
const router = express.Router();
const disponibilidadCuidadorController = require('../controllers/disponibilidadCuidadorController.js');

router.get('/cuidador/:idCuidador', disponibilidadCuidadorController.getDisponibilidadPorCuidador);
router.post('/', disponibilidadCuidadorController.createDisponibilidad);
router.delete('/:idCuidador/dia/:dia', disponibilidadCuidadorController.deleteDisponibilidad);

module.exports = router;