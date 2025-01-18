const express = require("express");
const   router = express.Router();
const usuarioController = require("../controllers/usuarioController.js");
const authMiddleware = require("../services/authMiddlewareService.js");
const upload = require('../utils/cloudinaryConfig.js').upload;
/**
 * @swagger
 * tags:
 *   name: Usuario
 *   description: API para gestionar usuarios
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Permite a un usuario iniciar sesión en el sistema.
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario
 *                 example: usuario@test.com
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Usuario logueado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario logueado con exito
 *                 token:
 *                   type: string
 *                   description: Token de autenticación
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 rol:
 *                   type: string
 *                   description: Rol del usuario
 *                   example: Cliente
 *                 idUsuario:
 *                   type: string
 *                   description: ID del usuario
 *                   example: 60d5f360a3f8b0928c8b4567
*       '404':
*         description: No existe ningún usuario registrado con el correo electrónico proporcionado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: No existe ningun usuario registrado con ese email
*       '400':
*         description: Error en la solicitud, por ejemplo, si la contraseña no coincide
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Error al iniciar sesión
*/
router.post("/login", usuarioController.login);
router.post("/", usuarioController.createNewUser);
router.get("/", authMiddleware.verifyToken, usuarioController.getUsers);
router.delete("/:id", authMiddleware.verifyToken, usuarioController.deleteUser);
router.put("/:id", authMiddleware.verifyToken, usuarioController.editUser);
//router.put('/update-password/:id', usuarioController.editPassword);
router.get( "/cuidadores-habilitados/", authMiddleware.verifyToken, usuarioController.getCuidadoresHabilitados);
router.get( "/cuidadores-pendientes/", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getCuidadoresPendientes);
router.get( "/clientes-con-reservas", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getClientesConReservasPorEstado);
router.get( "/cuidadores-con-reservas", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.getCuidadoresConReservasPorEstado);
router.get("/:id", authMiddleware.verifyToken, usuarioController.getOneUser);
// Ruta para cargar una imagen de perfil
router.post("/upload/:id", authMiddleware.verifyToken, upload.single('file'), usuarioController.guardarImagenPerfil);
router.put("/habilitar-cuidador/:id", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.habilitarCuidador);
router.put("/desaprobar-cuidador/:id", authMiddleware.verifyToken, authMiddleware.verifyAdmin, usuarioController.desaprobarCuidador);

module.exports = router;
