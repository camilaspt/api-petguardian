const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estadoController.js');
const authMiddleware = require("../services/authMiddlewareService.js");

/**
 * @swagger
 * tags:
 *   name: Estados
 *   description: API para gestionar Estados
 */

/**
 * @swagger
 * /api/estados:
 *   get:
 *     summary: Obtener todos los estados
 *     description: Permite obtener una lista de todos los estados.
 *     tags: [Estados]
 *     responses:
 *       '200':
 *         description: Lista de estados obtenida con éxito
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
 *                   estado:
 *                     type: string
 *                     example: Aprobada
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los estados
 */
router.get("/", authMiddleware.verifyToken, estadoController.getEstados);

/**
 * @swagger
 * /api/estados:
 *   post:
 *     summary: Crear un nuevo estado
 *     description: Permite crear un nuevo estado en el sistema.
 *     tags: [Estados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 description: El nombre del estado
 *                 example: Aprobada
 *     responses:
 *       '201':
 *         description: Estado creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 estado:
 *                   type: string
 *                   example: Aprobada
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear el estado
 */
router.post("/", authMiddleware.verifyToken, authMiddleware.verifyAdmin, estadoController.createEstado);

/**
 * @swagger
 * /api/estados/{id}:
 *   delete:
 *     summary: Eliminar un estado
 *     description: Permite eliminar un estado del sistema.
 *     tags: [Estados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estado a eliminar
 *     responses:
 *       '200':
 *         description: Estado eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estado eliminado con éxito
 *       '404':
 *         description: Estado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estado no encontrado
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar el estado
 */
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyAdmin, estadoController.deleteEstado);

module.exports = router;
