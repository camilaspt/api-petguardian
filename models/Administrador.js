const mongoose = require("mongoose");
const Usuario = require("../models/Usuario.js");

const adminSchema = new mongoose.Schema(
  {
    descripcionPersonal: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    discriminatorKey: "rol",
  }
);

const Administrador = Usuario.discriminator("Administrador", clienteSchema);

module.exports = Administrador;
