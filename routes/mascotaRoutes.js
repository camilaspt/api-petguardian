const express = require("express");
const router = express.Router();
const mascotaController = require("../controllers/mascotaController.js");
const authMiddleware = require("../services/authMiddlewareService.js");
const upload = require("../utils/cloudinaryConfig.js").upload;

/**
 * @swagger
 * tags:
 *   name: Mascota
 *   description: API para gestionar mascotas
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtener todas las mascotas
 *     description: Permite obtener una lista de todas las mascotas no eliminadas.
 *     tags: [Mascota]
 *     responses:
 *       '200':
 *         description: Lista de mascotas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   nombre:
 *                     type: string
 *                     example: Fido
 *                   tipoMascota:
 *                     type: string
 *                     example: Perro
 *                   etapaVida:
 *                     type: string
 *                     example: Cachorro
 *                   usuario:
 *                     type: string
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   eliminado:
 *                     type: boolean
 *                     example: false
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las mascotas
 */
router.get("/", authMiddleware.verifyToken, mascotaController.getMascotas);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Crear una nueva mascota
 *     description: Permite crear una nueva mascota.
 *     tags: [Mascota]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre de la mascota
 *                 example: Fido
 *               tipoMascota:
 *                 type: string
 *                 description: El tipo de mascota
 *                 example: Perro
 *               etapaVida:
 *                 type: string
 *                 description: La etapa de vida de la mascota
 *                 example: Cachorro
 *               usuario:
 *                 type: string
 *                 description: ID del usuario dueño de la mascota
 *                 example: 60d5f360a3f8b0928c8b4567
 *     responses:
 *       '201':
 *         description: Mascota creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 nombre:
 *                   type: string
 *                   example: Fido
 *                 tipoMascota:
 *                   type: string
 *                   example: Perro
 *                 etapaVida:
 *                   type: string
 *                   example: Cachorro
 *                 usuario:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear la mascota
 */
router.post("/", authMiddleware.verifyToken, authMiddleware.verifyCliente, mascotaController.createMascota);

/**
 * @swagger
 * /upload/{id}:
 *   post:
 *     summary: Cargar una imagen de mascota
 *     description: Permite cargar una imagen de mascota.
 *     tags: [Mascota]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: La imagen de la mascota a cargar
 *     responses:
 *       '200':
 *         description: Imagen cargada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagen cargada exitosamente
 *                 mascota:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5f360a3f8b0928c8b4567
 *                     nombre:
 *                       type: string
 *                       example: Fido
 *                     tipoMascota:
 *                       type: string
 *                       example: Perro
 *                     etapaVida:
 *                       type: string
 *                       example: Cachorro
 *                     usuario:
 *                       type: string
 *                       example: 60d5f360a3f8b0928c8b4567
 *                     urlImagen:
 *                       type: string
 *                       example: https://example.com/imagen.jpg
 *       '500':
 *         description: Error al cargar la imagen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al cargar la imagen
 */
router.post("/upload/:id", authMiddleware.verifyToken, authMiddleware.verifyCliente, upload.single("file"), mascotaController.guardarImagenMascota);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Eliminar una mascota
 *     description: Permite eliminar (marcar como eliminada) una mascota.
 *     tags: [Mascota]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a eliminar
 *     responses:
 *       '200':
 *         description: Mascota eliminada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mascota eliminada con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar la mascota
 */
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyCliente, mascotaController.deleteMascota);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Editar una mascota
 *     description: Permite editar la información de una mascota.
 *     tags: [Mascota]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre de la mascota
 *                 example: Fido
 *               tipoMascota:
 *                 type: string
 *                 description: El tipo de mascota
 *                 example: Perro
 *               etapaVida:
 *                 type: string
 *                 description: La etapa de vida de la mascota
 *                 example: Cachorro
 *               obsComida:
 *                 type: string
 *                 description: Observaciones sobre la comida
 *                 example: Come dos veces al día
 *               obsEnfermedades:
 *                 type: string
 *                 description: Observaciones sobre enfermedades
 *                 example: Ninguna
 *               obsOtros:
 *                 type: string
 *                 description: Otras observaciones
 *                 example: Le gusta jugar con pelotas
 *     responses:
 *       '200':
 *         description: Mascota editada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mascota editada con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al editar la mascota
 */
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyCliente, mascotaController.editMascota);

/**
 * @swagger
 * /mascotasPorUsuario/{id}:
 *   get:
 *     summary: Obtener mascotas por usuario
 *     description: Permite obtener una lista de mascotas de un usuario específico.
 *     tags: [Mascota]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       '200':
 *         description: Lista de mascotas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   nombre:
 *                     type: string
 *                     example: Fido
 *                   tipoMascota:
 *                     type: string
 *                     example: Perro
 *                   etapaVida:
 *                     type: string
 *                     example: Cachorro
 *                   usuario:
 *                     type: string
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   eliminado:
 *                     type: boolean
 *                     example: false
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las mascotas
 */
router.get("/mascotasPorUsuario/:id", authMiddleware.verifyToken, mascotaController.getMascotasPorUsuario);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Obtener una mascota
 *     description: Permite obtener la información de una mascota específica.
 *     tags: [Mascota]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       '200':
 *         description: Mascota obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 nombre:
 *                   type: string
 *                   example: Fido
 *                 tipoMascota:
 *                   type: string
 *                   example: Perro
 *                 etapaVida:
 *                   type: string
 *                   example: Cachorro
 *                 usuario:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 eliminado:
 *                   type: boolean
 *                   example: false
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener la mascota
 */
router.get("/:id", authMiddleware.verifyToken, mascotaController.getOneMascota);

module.exports = router;
