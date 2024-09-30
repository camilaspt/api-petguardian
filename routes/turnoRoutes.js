const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController.js');
const authMiddleware = require("../services/authMiddlewareService.js");

router.get('/', authMiddleware.verifyToken, turnoController.getTurnos);
router.post('/',authMiddleware.verifyToken, authMiddleware.verifyCliente, turnoController.createTurno);
router.delete('/:id', authMiddleware.verifyToken, turnoController.deleteTurno);

module.exports = router;