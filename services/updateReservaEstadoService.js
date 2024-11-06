const Reserva = require('../models/Reserva.js');
const Estado = require('../models/Estado.js');
const Usuario = require('../models/Usuario.js');
const {sendEmailState} = require('./emailService.js');

const updateReservaEstado = async (idReserva, idEstado) => {
    try {
        const reserva = await Reserva.findById(idReserva);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        const estadoNuevo = await Estado.findById(idEstado);
        if (!estadoNuevo) {
            return res.status(404).json({ message: 'Estado no encontrado' });
        }
        const cliente = await Usuario.findById(reserva.cliente);
        const cuidador = await Usuario.findById(reserva.cuidador);
        reserva.estado = estadoNuevo._id;
        await reserva.save();
        const mails = [cliente.email, cuidador.email];
        const cuerpo = [reserva.numeroReserva, estadoNuevo.estado].join(',');
        sendEmailState(mails, cuerpo);
        return reserva;
    } catch (error) {
        console.log(error)
        throw new Error(error.message);
    }
}


module.exports = {
    updateReservaEstado,
}