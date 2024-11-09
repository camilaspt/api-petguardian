const express = require('express');
const router = express.Router();
const disponibilidadCuidadorController = require('../controllers/disponibilidadCuidadorController.js');
const authMiddleware = require("../services/authMiddlewareService.js");

router.get('/cuidador/:idCuidador', authMiddleware.verifyToken, disponibilidadCuidadorController.getDisponibilidadPorCuidador);
router.post('/',authMiddleware.verifyToken, authMiddleware.verifyCuidadorHabilitado, disponibilidadCuidadorController.createDisponibilidad);
router.delete( "/:idCuidador/dia/:dia", authMiddleware.verifyToken, authMiddleware.verifyCuidadorHabilitado, disponibilidadCuidadorController.deleteDisponibilidad);
router.post('/crearTurnos/:idCuidador', authMiddleware.verifyToken, authMiddleware.verifyCuidadorHabilitado, disponibilidadCuidadorController.crearTurnos);     
module.exports = router;