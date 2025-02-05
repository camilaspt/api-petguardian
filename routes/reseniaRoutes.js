const express = require('express');
const router = express.Router();
const reseniaController = require('../controllers/reseniaController.js');
const authMiddleware = require("../services/authMiddlewareService.js");
/**
 * @swagger
 * tags:
 *   name: Reseñas
 *   description: API para gestionar Reseñas
 */

router.get('/',authMiddleware.verifyToken, reseniaController.getResenias);
router.post('/',authMiddleware.verifyToken, authMiddleware.verifyCliente, reseniaController.createResenia);
router.delete('/:id', authMiddleware.verifyToken, reseniaController.deleteResenia);
router.get("/:id", authMiddleware.verifyToken, reseniaController.getOneResenia);
router.get('/reseniaPorReserva/:id', authMiddleware.verifyToken, reseniaController.getReseniaPorReserva);
router.get( "/reseniasPorUsuario/:id", authMiddleware.verifyToken, reseniaController.getReseniasPorUsuario);
router.put("/:id", authMiddleware.verifyToken, reseniaController.updateResenia);

module.exports = router;