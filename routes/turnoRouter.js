const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController.js');

router.get('/', turnoController.getTurno);
router.post('/', turnoController.createTurno);
router.delete('/:id', turnoController.deleteTurno);
router.get('/turnosPorReserva/:id', turnoController.getTurnosPorReserva);

module.exports = router;