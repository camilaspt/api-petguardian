const mongoose = require('mongoose');
const TurnoSchema = new mongoose.Schema({
    fechaHoraInicio: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Turno', TurnoSchema);