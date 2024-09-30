const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js');
const authMiddleware = require("../services/authMiddlewareService.js");

router.get('/', usuarioController.getUsers);
router.post('/', usuarioController.createNewUser);
router.post('/login', usuarioController.login);
router.delete('/delete/:id', usuarioController.deleteUser);
router.put('/update/:id', usuarioController.editUser);
//router.put('/update-password/:id', usuarioController.editPassword);
router.get('/cuidadores-habilitados/', usuarioController.getCuidadoresHabilitados);
router.get('/cuidadores-pendientes/',authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getCuidadoresPendientes);
router.get( "/clientes-con-reservas", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getClientesConReservasPorEstado);
router.post("/cambiar-rol", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.cambiarRol);
router.get("/cuidadores-con-reservas", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getCuidadoresConReservasPorEstado);
router.get('/:id', usuarioController.getOneUser);



module.exports = router;