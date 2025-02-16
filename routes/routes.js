const express = require('express');
const router = express.Router();

//Rutas de la app
const usuarioRoutes = require('./usuarioRoutes.js');
const mascotaRoutes = require('./mascotaRoutes.js');
const etapaVidaRoutes = require('./etapaVidaRoutes.js');
const tipoMascotaRoutes = require('./tipoMascotaRoutes.js');
const estadoRoutes = require ('./estadoRoutes.js');
const reservaRoutes = require ('./reservaRoutes.js');
const turnoRoutes = require ('./turnoRoutes.js');
const disponibilidadCuidadorRoutes = require ('./disponibilidadCuidadorRoutes.js');
const reseniaRoutes = require ('./reseniaRoutes.js');
const informesRoutes = require('./informesRoutes.js');

router.use('/api/usuarios/', usuarioRoutes);
router.use('/api/mascotas/', mascotaRoutes);
router.use('/api/etapasVida/', etapaVidaRoutes);
router.use('/api/tiposMascota/', tipoMascotaRoutes);
router.use ('/api/estados/', estadoRoutes);
router.use ('/api/reservas/', reservaRoutes);
router.use ('/api/turnos/', turnoRoutes);
router.use ('/api/disponibilidadCuidador/', disponibilidadCuidadorRoutes);
router.use ('/api/resenias/', reseniaRoutes);
router.use('/api/informes/', informesRoutes);

module.exports = router;