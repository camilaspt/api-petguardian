const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController.js');

router.get('/', turnoController.getTurnos);
router.post('/', turnoController.createTurno);
router.delete('/:id', turnoController.deleteTurno);

module.exports = router;