const mongoose = require('mongoose');
const DisponibilidadCuidadorSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true
    },
    horas: {
        type: [String],
        required: true
    },

    cuidador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuidador',
        required: true
    }
}); 

module.exports = mongoose.model('DisponibilidadCuidador', DisponibilidadCuidadorSchema);