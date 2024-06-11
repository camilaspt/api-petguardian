const Reserva = require('../models/Reserva.js');

const getReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().populate('usuario', 'nombre').populate('mascotas', 'nombre').populate('estado', 'estado');
        res.status(200).json(reservas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createReserva = async (req, res) => {
    try {
        const { fecha, comentario, tarifaTurno, usuario, mascotas, } = req.body;
        const estadoPorDefecto = '6668b168a1b2bfba6786a917';
        const newReserva = await Reserva.create({ fecha, comentario, tarifaTurno, usuario, mascotas, estado: estadoPorDefecto});
        res.status(201).json(newReserva);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteReserva = async (req, res) => {
    try {
        const idReserva = req.params.id;
        const result = await Reserva.deleteOne({_id:idReserva});
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const editReserva = async (req, res) => {
    try {
        const idReserva = req.params.id;
        const {tarifaTurno, comentario, mascotas } = req.body;
        const result = await Reserva.updateOne({_id:idReserva}, {tarifaTurno, comentario, mascotas });
        res.status(200).json(result);
    }   catch (error) {
        res.status(400).json({ message: error.message });
    } 
}

const getReservasPorUsuario = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const reservas = await Reserva.find({usuario: idUsuario}).populate('usuario', 'nombre').populate('mascotas', 'nombre').populate('estado', 'estado');
        res.status(200).json(reservas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getOneReserva = async (req, res) => {
    try {
        const idReserva = req.params.id;
        const reserva = await Reserva.findById(idReserva).populate('usuario', 'nombre').populate('mascotas', 'nombre').populate('estado', 'estado');
        res.status(200).json(reserva);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


module.exports = {
    getReservas,
    createReserva,
    deleteReserva,
    editReserva,
    getReservasPorUsuario,
    getOneReserva
}