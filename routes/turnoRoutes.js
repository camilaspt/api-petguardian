const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController.js');
const authMiddleware = require("../services/authMiddlewareService.js");
/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: API para gestionar Turnos
 */
router.get('/', authMiddleware.verifyToken, turnoController.getTurnos);
router.post('/',authMiddleware.verifyToken, authMiddleware.verifyCliente, turnoController.createTurno);
router.post('/disponibilidad', authMiddleware.verifyToken, turnoController.getDisponibilidadCuidador); // devuelve las horas en las que se pueden realizar reservas
router.delete('/:id', authMiddleware.verifyToken, turnoController.deleteTurno);

module.exports = router;