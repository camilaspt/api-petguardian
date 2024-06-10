
const express = require('express');
const router = express.Router();
const etapaVidaController = require('../controllers/etapaVidaController.js');

router.get('/', etapaVidaController.getEtapasVida);
router.post('/', etapaVidaController.createEtapaVida);
router.delete('/:id', etapaVidaController.deleteEtapaVida);
router.put('/:id', etapaVidaController.editEtapaVida);

module.exports = router;