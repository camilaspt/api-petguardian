const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estadoController.js');
const authMiddleware = require("../services/authMiddlewareService.js");

/**
 * @swagger
 * tags:
 *   name: Estados
 *   description: API para gestionar estados
 */
router.get("/",authMiddleware.verifyToken,  estadoController.getEstados);
router.post( "/",  authMiddleware.verifyToken,  authMiddleware.verifyAdmin,  estadoController.createEstado);
router.delete("/:id", authMiddleware.verifyToken,  authMiddleware.verifyAdmin, estadoController.deleteEstado);

module.exports = router;
