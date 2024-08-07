const mongoose = require('mongoose');
const Usuario = require('../models/Usuario.js');

const clienteSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  contactoEmergencia : {
    type: Number,
    required: true,
    trim: true
  },
  nombreContactoEmergencia : {
    type: String,
    required: true,
    trim: true
  }
});

const Cliente = Usuario.discriminator('Cliente', clienteSchema);

module.exports = Cliente;