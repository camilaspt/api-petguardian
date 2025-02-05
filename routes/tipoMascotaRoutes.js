const express = require('express');
const router = express.Router();
const tipoMascotaController = require('../controllers/tipoMascotaController.js');
const authMiddleware = require("../services/authMiddlewareService.js");
/**
 * @swagger
 * tags:
 *   name: Mascotas
 *   description: API para gestionar Mascotas
 */
router.get( "/", authMiddleware.verifyToken, tipoMascotaController.getTiposMascota);
router.post( "/", authMiddleware.verifyToken, authMiddleware.verifyAdmin, tipoMascotaController.createTipoMascota);
router.delete( "/:id", authMiddleware.verifyToken, authMiddleware.verifyAdmin, tipoMascotaController.deleteTipoMascota);
router.put( "/:id", authMiddleware.verifyToken, authMiddleware.verifyAdmin, tipoMascotaController.editTipoMascota);

module.exports = router;