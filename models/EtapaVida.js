const mongoose = require('mongoose');
const EtapaVidaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    }
}); 

module.exports = mongoose.model('EtapaVida', EtapaVidaSchema);