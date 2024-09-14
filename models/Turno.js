const mongoose = require('mongoose');
const TurnoSchema = new mongoose.Schema({
    fechaHoraInicio: {
        type: Date,
        required: true
    },
        reserva: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reserva',
        required: true
    }
}); 

module.exports = mongoose.model('Turno', TurnoSchema);