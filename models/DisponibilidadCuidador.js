const mongoose = require('mongoose');
const DisponibilidadCuidadorSchema = new mongoose.Schema({
    inicio: {
        type: Date,
        required: true
    },
    fin: {
        type: Date,
        required: true
    },
}); 

module.exports = mongoose.model('DisponibilidadCuidador', DisponibilidadCuidadorSchema);