const moongose = require('mongoose');
const UsuarioSchema = new moongose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    domicilio: {
        type: String,
        required: true,
        trim: true
    },
    rol: {
        type: String,
        required: true,
        trim: true
    },
    habilitado: {
        type: Boolean,
        default: false
    }
});

module.exports = moongose.model('Usuario', UsuarioSchema);