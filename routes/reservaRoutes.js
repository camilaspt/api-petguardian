const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController.js');

router.get('/', reservaController.getReservas);
router.post('/', reservaController.createReserva);
router.delete('/:id', reservaController.deleteReserva);
router.put('/:id', reservaController.editReserva);
router.get('/reservasPorUsuario/:id', reservaController.getReservasPorUsuario);
router.get('/:id', reservaController.getOneReserva);
router.patch('/:idReserva/:idEstado', reservaController.updateReservaEstado);

module.exports = router;