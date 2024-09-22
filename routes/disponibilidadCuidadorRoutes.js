const express = require('express');
const router = express.Router();
const disponibilidadCuidadorController = require('../controllers/disponibilidadCuidadorController.js');

router.get('/', disponibilidadCuidadorController.getDisponibilidad);
router.post('/', disponibilidadCuidadorController.createDisponibilidad);
router.delete('/:id', disponibilidadCuidadorController.deleteDisponibilidad);

//necesito repensar el tipo de datos disponibilidadCuidador y agregar varios endpoints
//El cuidador será el encargado de registrar su disponibilidad horaria, marcando en qué días y en qué horario podrá realizar visitas.

module.exports = router;