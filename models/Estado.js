const moongose = require('mongoose');
const EstadoSchema = new moongose.Schema({
    estado :{
        type: String,
        required: true,
        trim: true
    }
});

module.exports = moongose.model('Estado', EstadoSchema);