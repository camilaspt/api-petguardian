const express = require('express');
const router = express.Router();
const disponibilidadCuidadorController = require('../controllers/disponibilidadCuidadorController.js');
const authMiddleware = require("../services/authMiddlewareService.js");

router.get( "/", authMiddleware.verifyToken, disponibilidadCuidadorController.getDisponibilidadesPorCuidador);
router.post('/',authMiddleware.verifyToken, authMiddleware.verifyCuidadorHabilitado, disponibilidadCuidadorController.createDisponibilidad);
router.post( "/update",  authMiddleware.verifyToken,  authMiddleware.verifyCuidadorHabilitado,  disponibilidadCuidadorController.createOrUpdateDisponibilidad);
router.delete("/", authMiddleware.verifyToken, authMiddleware.verifyCuidadorHabilitado, disponibilidadCuidadorController.deleteDisponibilidad);    

module.exports = router;