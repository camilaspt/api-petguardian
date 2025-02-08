const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController.js');
const authMiddleware = require("../services/authMiddlewareService.js");

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: API para gestionar Turnos
 */

/**
 * @swagger
 * /api/turnos:
 *   get:
 *     summary: Obtener todos los turnos
 *     description: Permite obtener una lista de todos los turnos.
 *     tags: [Turnos]
 *     responses:
 *       '200':
 *         description: Lista de turnos obtenida con éxito
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
 *                   fechaHoraInicio:
 *                     type: string
 *                     format: date-time
 *                     example: 2023-10-15T08:00:00Z
 *                   reserva:
 *                     type: string
 *                     example: 60d5f360a3f8b0928c8b4567
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los turnos
 */
router.get('/', authMiddleware.verifyToken, turnoController.getTurnos);

/**
 * @swagger
 * /api/turnos:
 *   post:
 *     summary: Crear un nuevo turno
 *     description: Permite crear un nuevo turno en el sistema.
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaHoraInicio:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de inicio del turno
 *                 example: 2023-10-15T08:00:00Z
 *               reserva:
 *                 type: string
 *                 description: ID de la reserva asociada al turno
 *                 example: 60d5f360a3f8b0928c8b4567
 *     responses:
 *       '201':
 *         description: Turno creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f360a3f8b0928c8b4567
 *                 fechaHoraInicio:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-15T08:00:00Z
 *                 reserva:
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
 *                   example: Error al crear el turno
 */
router.post('/', authMiddleware.verifyToken, authMiddleware.verifyCliente, turnoController.createTurno);

/**
 * @swagger
 * /api/turnos/disponibilidad:
 *   post:
 *     summary: Obtener disponibilidad de un cuidador
 *     description: Permite obtener la disponibilidad de un cuidador en un rango de fechas.
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cuidadorId:
 *                 type: string
 *                 description: ID del cuidador
 *                 example: 60d5f360a3f8b0928c8b4567
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del rango
 *                 example: 2023-10-15
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del rango
 *                 example: 2023-10-20
 *     responses:
 *       '200':
 *         description: Disponibilidad obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "08:00"
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener la disponibilidad
 */
router.post('/disponibilidad', authMiddleware.verifyToken, turnoController.getDisponibilidadCuidador);

/**
 * @swagger
 * /api/turnos/{id}:
 *   delete:
 *     summary: Eliminar un turno
 *     description: Permite eliminar un turno del sistema.
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a eliminar
 *     responses:
 *       '200':
 *         description: Turno eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Turno eliminado con éxito
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar el turno
 */
router.delete('/:id', authMiddleware.verifyToken, turnoController.deleteTurno);

module.exports = router;