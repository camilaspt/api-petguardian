const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estadoController.js');

router.get("/", estadoController.getEstados);
router.post("/", estadoController.createEstado);
router.delete("/:id", estadoController.deleteEstado);

module.exports = router;
