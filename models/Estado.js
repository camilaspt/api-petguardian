const moongose = require('mongoose');
const EstadoSchema = new moongose.Schema({
  estado: {
    type: String,
    required: true,
    trim: true,
    enum: ["Pendiente", "Aprobada", "No aprobada", "Cancelada", "Finalizada"],
  },
});

module.exports = moongose.model('Estado', EstadoSchema);