
const express = require('express');
const router = express.Router();
const etapaVidaController = require('../controllers/etapaVidaController.js');
const authMiddleware = require("../services/authMiddlewareService.js");

router.get("/", authMiddleware.verifyToken, etapaVidaController.getEtapasVida);
router.post( "/",  authMiddleware.verifyToken,  authMiddleware.verifyAdmin,  etapaVidaController.createEtapaVida);
router.delete(  "/:id",  authMiddleware.verifyToken,  authMiddleware.verifyAdmin,  etapaVidaController.deleteEtapaVida);
router.put(  "/:id",  authMiddleware.verifyToken,  authMiddleware.verifyAdmin,  etapaVidaController.editEtapaVida);

module.exports = router;