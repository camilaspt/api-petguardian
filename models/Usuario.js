const mongoose = require("mongoose");
const UsuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    domicilio: {
      type: String,
      required: false,
      trim: true,
    },
    imagenPerfil: {
      type: String,
      required: false,
      trim: true
    },
    rol: {
      type: String,
      required: true,
      enum: [
        "Cuidador Habilitado",
        "Cuidador No Habilitado",
        "Cuidador Pendiente",
        "Cliente",
        "Administrador",
      ],
      trim: true,
    },
    contactoEmergencia: {
      //Campo para cliente
      type: Number,
      required: false,
      trim: true,
    },
    nombreContactoEmergencia: {
      //Campo para cliente
      type: String,
      required: false,
      trim: true,
    },
    descripcionPersonal: {
      //Campo para cuidador
      type: String,
      required: false,
      trim: true,
    },
    tarifaHora: {
      //Campo para cuidador
      type: Number,
      required: false,
      trim: true,
    },
    promedioPuntuacion: {
      //Campo para cuidador
      type: Number,
      required: false,
      trim: true,
      default: 0,
    },
    eliminado: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); 

module.exports = mongoose.model("Usuario", UsuarioSchema);