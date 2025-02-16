const express = require("express");
const router = express.Router();
const informesController = require("../controllers/informesController.js");
const authMiddleware = require("../services/authMiddlewareService.js");

/**
 * @swagger
 * tags:
 *   name: Informes
 *   description: API para gestionar Informes
 */

/**
 * @swagger
 * /api/informes/clientes-con-reservas:
 *   get:
 *     summary: Obtener clientes con reservas por estado
 *     description: Permite obtener una lista de clientes con sus reservas filtradas por estado.
 *     tags: [Informes]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre del cliente
 *       - in: query
 *         name: apellido
 *         schema:
 *           type: string
 *         description: Apellido del cliente
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email del cliente
 *       - in: query
 *         name: reservasMin
 *         schema:
 *           type: integer
 *         description: Número mínimo de reservas
 *       - in: query
 *         name: reservasMax
 *         schema:
 *           type: integer
 *         description: Número máximo de reservas
 *     responses:
 *       '200':
 *         description: Lista de clientes con reservas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d5f360a3f8b0928c8b4567
 *                       nombre:
 *                         type: string
 *                         example: Juan
 *                       apellido:
 *                         type: string
 *                         example: Perez
 *                       email:
 *                         type: string
 *                         example: usuario@test.com
 *                       telefono:
 *                         type: string
 *                         example: 123456789
 *                       reservasCanceladas:
 *                         type: integer
 *                         example: 2
 *                       reservasFinalizadas:
 *                         type: integer
 *                         example: 5
 *                       reservasAprobadas:
 *                         type: integer
 *                         example: 3
 *                       reservasPendientes:
 *                         type: integer
 *                         example: 1
 *                       reservasNoAprobadas:
 *                         type: integer
 *                         example: 0
 *                       reservasTotales:
 *                         type: integer
 *                         example: 11
 *                 estadisticas:
 *                   type: object
 *                   properties:
 *                     totalClientes:
 *                       type: integer
 *                       example: 100
 *                     clientesFiltrados:
 *                       type: integer
 *                       example: 10
 *                     clientes1a10:
 *                       type: integer
 *                       example: 5
 *                     clientes11a20:
 *                       type: integer
 *                       example: 3
 *                     clientes21a50:
 *                       type: integer
 *                       example: 2
 *                     clientes51a100:
 *                       type: integer
 *                       example: 0
 *       '500':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los clientes con reservas
 */
router.get(
  "/clientes-con-reservas",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  informesController.getClientesConReservasPorEstado
);

/**
 * @swagger
 * /api/informes/cuidadores-con-reservas:
 *   get:
 *     summary: Obtener cuidadores con reservas por estado
 *     description: Permite obtener una lista de cuidadores con sus reservas filtradas por estado.
 *     tags: [Informes]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre del cuidador
 *       - in: query
 *         name: apellido
 *         schema:
 *           type: string
 *         description: Apellido del cuidador
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email del cuidador
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Estado del cuidador (Habilitado, No habilitado, Pendiente)
 *     responses:
 *       '200':
 *         description: Lista de cuidadores con reservas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cuidadores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d5f360a3f8b0928c8b4567
 *                       nombre:
 *                         type: string
 *                         example: Juan
 *                       apellido:
 *                         type: string
 *                         example: Perez
 *                       email:
 *                         type: string
 *                         example: cuidador@test.com
 *                       telefono:
 *                         type: string
 *                         example: 123456789
 *                       estado:
 *                         type: string
 *                         example: Habilitado
 *                       tarifa:
 *                         type: number
 *                         example: 20
 *                       promedioPuntuacion:
 *                         type: number
 *                         example: 4.5
 *                       reservasTotales:
 *                         type: integer
 *                         example: 11
 *                       reservasCanceladas:
 *                         type: integer
 *                         example: 2
 *                       reservasFinalizadas:
 *                         type: integer
 *                         example: 5
 *                       reservasAprobadas:
 *                         type: integer
 *                         example: 3
 *                       reservasPendientes:
 *                         type: integer
 *                         example: 1
 *                       reservasNoAprobadas:
 *                         type: integer
 *                         example: 0
 *                 estadisticas:
 *                   type: object
 *                   properties:
 *                     cuidadoresPendientes:
 *                       type: integer
 *                       example: 10
 *                     cuidadoresHabilitados:
 *                       type: integer
 *                       example: 5
 *                     cuidadoresNoHabilitados:
 *                       type: integer
 *                       example: 3
 *                     totalCuidadores:
 *                       type: integer
 *                       example: 18
 *                     cuidadoresFiltrados:
 *                       type: integer
 *                       example: 8
 *                     promedioPuntuacionHabilitados:
 *                       type: number
 *                       example: 4.2
 *       '500':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los cuidadores con reservas
 */
router.get(
  "/cuidadores-con-reservas",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  informesController.getCuidadoresConReservasPorEstado
);

/**
 * @swagger
 * /api/informes/reservas:
 *   get:
 *     summary: Obtener todas las reservas
 *     description: Permite obtener una lista de todas las reservas para el informe de admin.
 *     tags: [Informes]
 *     responses:
 *       '200':
 *         description: Lista de reservas obtenida con éxito
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
 *                   fechaInicio:
 *                     type: string
 *                     format: date
 *                     example: 2023-10-15
 *                   fechaFin:
 *                     type: string
 *                     format: date
 *                     example: 2023-10-20
 *                   comentario:
 *                     type: string
 *                     example: Necesito que cuiden a mi perro
 *                   cliente:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: Juan
 *                       apellido:
 *                         type: string
 *                         example: Perez
 *                       telefono:
 *                         type: string
 *                         example: 123456789
 *                   cuidador:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: Maria
 *                       apellido:
 *                         type: string
 *                         example: Lopez
 *                       telefono:
 *                         type: string
 *                         example: 987654321
 *                   estado:
 *                     type: object
 *                     properties:
 *                       estado:
 *                         type: string
 *                         example: Aprobada
 *                   resenia:
 *                     type: object
 *                     properties:
 *                       puntuacion:
 *                         type: number
 *                         example: 5
 *                       comentario:
 *                         type: string
 *                         example: Excelente servicio
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las reservas
 */
router.get(
  "/reservas",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  informesController.getReservas
);

module.exports = router;