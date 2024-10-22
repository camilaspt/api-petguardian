const mongoose = require('mongoose');
const MascotaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    tipoMascota: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoMascota',
        required: true
    },
    etapaVida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EtapaVida',
        required: true
    },
    obsComida: {
        type: String,
        trim: true
    },
    obsEnfermedades: {
        type: String,
        trim: true
    },
    obsOtros: {
        type: String,
        trim: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    eliminado: {
        type: Boolean,
        default: false
    },
    urlImagen: {
        type: String,
        required: false
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Mascota', MascotaSchema);