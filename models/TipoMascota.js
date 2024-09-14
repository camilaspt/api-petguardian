const mongoose = require('mongoose');
const TipoMascotaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    }
}); 

module.exports = mongoose.model('TipoMascota', TipoMascotaSchema);