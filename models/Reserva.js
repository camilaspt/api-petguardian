const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ReservaSchema = new mongoose.Schema(
  {
    fechaInicio: {
      type: Date,
      required: true,
      trim: true,
    },
    fechaFin: {
      type: Date,
      required: true,
      trim: true,
    },
    tarifaTurno: {
      type: Number,
      required: true,
      trim: true,
    },
    comentario: {
      type: String,
      trim: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    cuidador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    mascotas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mascota",
        required: true,
      },
    ],
    estado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estado",
      required: true,
    },
    resenia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resenia",
      required: false,
    },
    contadorTurnos: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
); 

ReservaSchema.plugin(AutoIncrement, { inc_field: 'numeroReserva' });

module.exports = mongoose.model("Reserva", ReservaSchema);
