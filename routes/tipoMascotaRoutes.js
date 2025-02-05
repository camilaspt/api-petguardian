const express = require('express');
const router = express.Router();
const tipoMascotaController = require('../controllers/tipoMascotaController.js');
const authMiddleware = require("../services/authMiddlewareService.js");

/**
 * @swagger
 * tags:
 *   name: Mascotas
 *   description: API para gestionar Mascotas
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtener todos los tipos de mascota
 *     description: Permite obtener una lista de todos los tipos de mascota.
 *     tags: [Mascotas]
 *     responses:
 *       '200':
 *         description: Lista de tipos de mascota obtenida con éxito
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
 *                     example: Perro
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los tipos de mascota
 */
router.get("/", authMiddleware.verifyToken, tipoMascotaController.getTiposMascota);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Crear un nuevo tipo de mascota
 *     description: Permite crear un nuevo tipo de mascota en el sistema.
 *     tags: [Mascotas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre del tipo de mascota
 *                 example: Perro
 *     responses:
 *       '201':
 *         description: Tipo de mascota creado con éxito
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
 *                   example: Perro
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear el tipo de mascota
 */
router.post("/", authMiddleware.verifyToken, authMiddleware.verifyAdmin, tipoMascotaController.createTipoMascota);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Eliminar un tipo de mascota
 *     description: Permite eliminar un tipo de mascota del sistema.
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tipo de mascota a eliminar
 *     responses:
 *       '200':
 *         description: Tipo de mascota eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tipo de mascota eliminado con éxito
 *       '404':
 *         description: Tipo de mascota no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tipo de mascota no encontrado
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar el tipo de mascota
 */
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyAdmin, tipoMascotaController.deleteTipoMascota);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Editar un tipo de mascota
 *     description: Permite editar la información de un tipo de mascota en el sistema.
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tipo de mascota a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre del tipo de mascota
 *                 example: Gato
 *     responses:
 *       '200':
 *         description: Tipo de mascota editado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tipo de mascota editado con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al editar el tipo de mascota
 */
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyAdmin, tipoMascotaController.editTipoMascota);

module.exports = router;