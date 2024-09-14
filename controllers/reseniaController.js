const Reser = require('../models/Reserva');
const Resenia = require('../models/Resenia');

const getResenias = async (req, res) => {
    try {
        const resenias = await Resenia.find().populate('reserva', 'usuario');
        res.status(200).json(resenias);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createResenia = async (req, res) => {
    try {
        const { reserva, puntuacion, comentario } = req.body;
        const newResenia = await Resenia.create({ reserva, puntuacion, comentario });
        res.status(201).json(newResenia);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteResenia = async (req, res) => {
    try {
        const idResenia = req.params.id;
        const result = await Resenia.deleteOne({_id:idResenia});
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getOneResenia = async (req, res) => {
    try {
        const idResenia = req.params.id;
        const resenia = await Resenia.findById(idResenia);
        res.status(200).json(resenia);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getReseniaPorReserva = async (req, res) => {
    try {
        const idReserva = req.params.id;
        const resenia = await Resenia.find({reserva: idReserva});
        res.status(200).json(resenia);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getReseniasPorUsuario = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const reservas = await Reser.find({ usuario: idUsuario });
        const reservasId = reservas.map(reserva => reserva._id);
        const resenias = await Resenia.find({ reserva: { $in: reservasId } });
        if (resenias.length === 0) {
            return res.status(404).json({ message: 'No se encontraron reseñas para este Cuidador.' });
        }
        res.status(200).json(resenias);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getResenias,
    createResenia,
    deleteResenia,
    getOneResenia,
    getReseniaPorReserva,
    getReseniasPorUsuario
}