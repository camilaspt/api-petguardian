const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController.js');
const authMiddleware = require("../services/authMiddlewareService.js");


router.get('/',authMiddleware.verifyToken, mascotaController.getMascotas);
router.post('/',authMiddleware.verifyToken,  authMiddleware.verifyCliente, mascotaController.createMascota);
router.delete('/:id',authMiddleware.verifyToken,  authMiddleware.verifyCliente, mascotaController.deleteMascota);
router.put('/:id',authMiddleware.verifyToken,  authMiddleware.verifyCliente, mascotaController.editMascota);
router.get('/mascotasPorUsuario/:id',authMiddleware.verifyToken, mascotaController.getMascotasPorUsuario);
router.get('/:id',authMiddleware.verifyToken, mascotaController.getOneMascota);


module.exports = router;
