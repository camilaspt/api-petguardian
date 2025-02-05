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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtener todas las reseñas
 *     description: Permite obtener una lista de todas las reseñas.
 *     tags: [Reseñas]
 *     responses:
 *       '200':
 *         description: Lista de reseñas obtenida con éxito
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
 *                   reserva:
 *                     type: string
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   puntuacion:
 *                     type: number
 *                     example: 5
 *                   comentario:
 *                     type: string
 *                     example: Excelente servicio
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las reseñas
 */
router.get('/', authMiddleware.verifyToken, reseniaController.getResenias);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Crear una nueva reseña
 *     description: Permite crear una nueva reseña.
 *     tags: [Reseñas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reserva:
 *                 type: string
 *                 description: ID de la reserva
 *                 example: 60d5f360a3f8b0928c8b4567
 *               puntuacion:
 *                 type: number
 *                 description: Puntuación de la reseña
 *                 example: 5
 *               comentario:
 *                 type: string
 *                 description: Comentario de la reseña
 *                 example: Excelente servicio
 *     responses:
 *       '201':
 *         description: Reseña creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 reserva:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 puntuacion:
 *                   type: number
 *                   example: 5
 *                 comentario:
 *                   type: string
 *                   example: Excelente servicio
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear la reseña
 */
router.post('/', authMiddleware.verifyToken, authMiddleware.verifyCliente, reseniaController.createResenia);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Eliminar una reseña
 *     description: Permite eliminar una reseña.
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña a eliminar
 *     responses:
 *       '200':
 *         description: Reseña eliminada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reseña eliminada con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar la reseña
 */
router.delete('/:id', authMiddleware.verifyToken, reseniaController.deleteResenia);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Obtener una reseña
 *     description: Permite obtener la información de una reseña específica.
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña
 *     responses:
 *       '200':
 *         description: Reseña obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 reserva:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 puntuacion:
 *                   type: number
 *                   example: 5
 *                 comentario:
 *                   type: string
 *                   example: Excelente servicio
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener la reseña
 */
router.get("/:id", authMiddleware.verifyToken, reseniaController.getOneResenia);

/**
 * @swagger
 * /reseniaPorReserva/{id}:
 *   get:
 *     summary: Obtener reseña por reserva
 *     description: Permite obtener la reseña de una reserva específica.
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       '200':
 *         description: Reseña obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 reserva:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 puntuacion:
 *                   type: number
 *                   example: 5
 *                 comentario:
 *                   type: string
 *                   example: Excelente servicio
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener la reseña
 */
router.get('/reseniaPorReserva/:id', authMiddleware.verifyToken, reseniaController.getReseniaPorReserva);

/**
 * @swagger
 * /reseniasPorUsuario/{id}:
 *   get:
 *     summary: Obtener reseñas por usuario
 *     description: Permite obtener una lista de reseñas de un usuario específico.
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       '200':
 *         description: Lista de reseñas obtenida con éxito
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
 *                   reserva:
 *                     type: string
 *                     example: 60d5f360a3f8b0928c8b4567
 *                   puntuacion:
 *                     type: number
 *                     example: 5
 *                   comentario:
 *                     type: string
 *                     example: Excelente servicio
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las reseñas
 */
router.get('/reseniasPorUsuario/:id', authMiddleware.verifyToken, reseniaController.getReseniasPorUsuario);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Editar una reseña
 *     description: Permite editar una reseña existente.
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comentario:
 *                 type: string
 *                 description: Comentario de la reseña
 *                 example: Excelente servicio
 *     responses:
 *       '200':
 *         description: Reseña editada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reseña editada con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al editar la reseña
 */
router.put("/:id", authMiddleware.verifyToken, reseniaController.updateResenia);

module.exports = router;