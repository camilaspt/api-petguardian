const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController.js');

router.get('/', reservaController.getReservas);
router.post('/', reservaController.createReserva);
router.delete('/:id', reservaController.deleteReserva);
router.put('/:id', reservaController.editReserva);
router.get('/reservas-por-cliente/:id', reservaController.getReservasPorCliente);
router.get('/reservas-por-cuidador/:id', reservaController.getReservasPorCuidador);
router.get('/:id', reservaController.getOneReserva);
router.patch('/:idReserva/estado/:idEstado', reservaController.updateReservaEstado);

module.exports = router;