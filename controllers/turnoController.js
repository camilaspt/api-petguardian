const Turno = require('../models/Turno.js');

const getTurno = async (req, res) => {
    try {
        const turnos = await Turno.find().populate('reserva', 'nombre');
        res.status(200).json(turnos);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createMascota = async (req, res) => {
    try {
        const { nombre, tipoMascota, etapaVida, obsComida, obsEnfermedades, obsOtros, usuario } = req.body;
        const newMascota = await Mascota.create({ nombre, tipoMascota, etapaVida, obsComida, obsEnfermedades, obsOtros, usuario });
        res.status(201).json(newMascota);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteMascota = async (req, res) => {
    try {
        const idMascota = req.params.id;
        const result = await Mascota.deleteOne({_id:idMascota});
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const editMascota = async (req, res) => {
    try {
        const idMascota = req.params.id;
        const { nombre, tipoMascota, etapaVida, obsComida, obsEnfermedades, obsOtros } = req.body;
        const result = await Mascota.updateOne({_id:idMascota}, { nombre, tipoMascota, etapaVida, obsComida, obsEnfermedades, obsOtros });
        res.status(200).json(result);
    }   catch (error) {
        res.status(400).json({ message: error.message });
    } 
}

const getMascotasPorUsuario = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const mascotas = await Mascota.find({usuario: idUsuario}).populate('usuario', 'nombre').populate('tipoMascota', 'nombre').populate('etapaVida', 'nombre');
        res.status(200).json(mascotas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getTurno,
    createTurno,
    deleteTurno,
    getTurnosPorReserva
}