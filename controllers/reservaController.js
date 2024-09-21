const Reserva = require('../models/Reserva.js');
const Estado = require('../models/Estado.js');
const Usuario = require('../models/Usuario.js');
const {sendEmailState} = require('../services/emailService.js');

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
        const { fechaInicio, fechaFin, comentario, tarifaTurno, usuario, mascotas} = req.body;
        const estado = await Estado.findOne({ estado: 'Pendiente' });;
        const newReserva = await Reserva.create({ fechaInicio, fechaFin, comentario, tarifaTurno, usuario, mascotas, estado: estado._id});
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

const updateReservaEstado = async (req, res) => {
    try {
        const idReserva = req.params.idReserva;
        const idEstado = req.params.idEstado;
        const reserva = await Reserva.findById(idReserva);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        const estadoNuevo = await Estado.findById(idEstado);
        if (!estadoNuevo) {
            return res.status(404).json({ message: 'Estado no encontrado' });
        }
        const usuario = await Usuario.findById(reserva.usuario);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        reserva.estado = estadoNuevo._id;
        await reserva.save();
        sendEmailState(usuario.email, estadoNuevo.estado);
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
    getOneReserva,
    updateReservaEstado
}