const mongoose = require('mongoose');
const TurnoSchema = new mongoose.Schema({
    fechaHoraInicio: {
        type: Timestamp,
        required: true,
        trim: true
    },
    reserva: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reserva',
        required: true
    }
});

module.exports = mongoose.model('Turno', TurnoSchema);