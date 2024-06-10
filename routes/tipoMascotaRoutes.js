const express = require('express');
const router = express.Router();
const tipoMascotaController = require('../controllers/tipoMascotaController.js');

router.get('/', tipoMascotaController.getTiposMascota);
router.post('/', tipoMascotaController.createTipoMascota);
router.delete('/:id', tipoMascotaController.deleteTipoMascota);
router.put('/:id', tipoMascotaController.editTipoMascota);

module.exports = router;