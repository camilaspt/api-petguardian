const Reserva = require('../models/Reserva.js');
const Estado = require('../models/Estado.js');
const serviceUpdate = require('../services/updateReservaEstado.js');

const getReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().populate('cliente', 'nombre').populate('cuidador', 'nombre').populate('mascotas', 'nombre').populate('estado', 'estado');
        res.status(200).json(reservas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createReserva = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, comentario, tarifaTurno, cliente, cuidador, mascotas} = req.body;
        const estado = await Estado.findOne({ estado: 'Pendiente' });
        const newReserva = await Reserva.create({ fechaInicio, fechaFin, comentario, tarifaTurno, cliente, cuidador, mascotas, estado: estado._id});
        res.status(201).json(newReserva);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteReserva = async (req, res) => {
    try {
        const idReserva = req.params.id;
        const reserva = await Reserva.findById(idReserva);
        const estado = await Estado.findOne({ estado: 'Pendiente' });
        if (reserva.estado != estado._id) {
            return res.status(400).json({ message: 'No se puede eliminar una reserva que no esté en estado Pendiente' });
        }
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

const getReservasPorCliente = async (req, res) => {
    try {
        const idCliente = req.params.id;
        const reservas = await Reserva.find({cliente: idCliente}).populate('cuidador', 'nombre').populate('mascotas', 'nombre').populate('estado', 'estado');
        res.status(200).json(reservas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getReservasPorCuidador = async (req, res) => {
    try {
        const idCuidador = req.params.id;
        const reservas = await Reserva.find({cuidador: idCuidador}).populate('cliente', 'nombre').populate('mascotas', 'nombre').populate('estado', 'estado');
        res.status(200).json(reservas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getOneReserva = async (req, res) => {
    try {
        const idReserva = req.params.id;
        const reserva = await Reserva.findById(idReserva).populate('cliente', 'nombre').populate('cuidador', 'nombre').populate('mascotas', 'nombre').populate('estado', 'estado');
        res.status(200).json(reserva);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updateReservaEstado = async (req, res) => {
    try {
        const idReserva = req.params.idReserva;
        const idEstado = req.params.idEstado;
        const reserva = await serviceUpdate.updateReservaEstado(idReserva, idEstado);
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
    getReservasPorCliente,
    getReservasPorCuidador,
    getOneReserva,
    updateReservaEstado
}