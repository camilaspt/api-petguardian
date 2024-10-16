const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js');
const authMiddleware = require("../services/authMiddlewareService.js");

router.post("/login", usuarioController.login);
router.post("/", usuarioController.createNewUser);
router.get('/', authMiddleware.verifyToken, usuarioController.getUsers);
router.delete('/:id', authMiddleware.verifyToken, usuarioController.deleteUser);
router.put('/:id', authMiddleware.verifyToken, usuarioController.editUser);
//router.put('/update-password/:id', usuarioController.editPassword);
router.get('/cuidadores-habilitados/', authMiddleware.verifyToken, usuarioController.getCuidadoresHabilitados);
router.get('/cuidadores-pendientes/',authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getCuidadoresPendientes);
router.get( "/clientes-con-reservas", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getClientesConReservasPorEstado);
router.post("/cambiar-rol", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.cambiarRol);
router.get("/cuidadores-con-reservas", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getCuidadoresConReservasPorEstado);
router.get('/:id', authMiddleware.verifyToken, usuarioController.getOneUser);



module.exports = router;