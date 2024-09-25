const mongoose = require('mongoose');
const DisponibilidadCuidadorSchema = new mongoose.Schema({
    dia: {
        type: String,
        required: true,
        enum: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
    },
    horaInicio: {
        type: String,
        required: true
    },
    horaFin: {
        type: String,
        required: true
    },
    cuidador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuidador',
        required: true
    }
}); 

module.exports = mongoose.model('DisponibilidadCuidador', DisponibilidadCuidadorSchema);