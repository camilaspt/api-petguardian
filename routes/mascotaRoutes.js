const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController.js');

router.get('/', mascotaController.getMascotas);
router.post('/', mascotaController.createMascota);
router.delete('/:id', mascotaController.deleteMascota);
router.put('/:id', mascotaController.editMascota);
router.get('/mascotasPorUsuario/:id', mascotaController.getMascotasPorUsuario);
router.get('/:id', mascotaController.getOneMascota);

module.exports = router;
