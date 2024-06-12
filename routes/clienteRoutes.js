const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController.js');

router.get("/", clienteController.getClientes);
router.post("/", clienteController.createCliente);

module.exports = router;