const mongoose = require("mongoose");
const ReservaSchema = new mongoose.Schema({
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

  usuario: {
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
}, { timestamps: true }); 

module.exports = mongoose.model("Reserva", ReservaSchema);
