const mongoose = require("mongoose");
const ReseniaSchema = new mongoose.Schema({
  reserva: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reserva",
    required: true,
  },
 
  puntuacion: {
    type: Number,
    required: true,
    trim: true,
  },
  
  comentario: {
    type: String,
    trim: true,
  }
}, { timestamps: true }); 

module.exports = mongoose.model("Resenia", ReseniaSchema);