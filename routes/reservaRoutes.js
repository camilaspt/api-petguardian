const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController.js');
const authMiddleware = require("../services/authMiddlewareService.js");


router.post('/',authMiddleware.verifyToken, authMiddleware.verifyCliente, reservaController.createReserva);
router.delete('/:id',authMiddleware.verifyToken, authMiddleware.verifyAdmin, reservaController.deleteReserva); 
router.put('/:id',authMiddleware.verifyToken, reservaController.editReserva); //posiblemente haya que borrarlo
router.get('/reservasPorCliente/:id',authMiddleware.verifyToken, authMiddleware.verifyCliente, reservaController.getReservasPorCliente);
router.get('/reservasPorCuidador/:id',authMiddleware.verifyToken, authMiddleware.verifyCuidadorHabilitado, reservaController.getReservasPorCuidador);
router.get( "/", authMiddleware.verifyToken, authMiddleware.verifyAdmin, reservaController.getReservas); //get all reservas para el Informe de admin
router.put('/cancelar/:idReserva', authMiddleware.verifyToken, authMiddleware.verifyCliente, reservaController.cancelarReserva);
router.put('/aprobar/:idReserva', authMiddleware.verifyToken, authMiddleware.verifyCuidadorHabilitado, reservaController.aprobarReserva);
router.put('/rechazar/:idReserva', authMiddleware.verifyToken, authMiddleware.verifyCuidadorHabilitado, reservaController.rechazarReserva);
router.put('/anular/:idReserva', authMiddleware.verifyToken, authMiddleware.verifyCuidadorHabilitado, reservaController.anularReserva);
router.get("/:id", authMiddleware.verifyToken, reservaController.getOneReserva);

module.exports = router;