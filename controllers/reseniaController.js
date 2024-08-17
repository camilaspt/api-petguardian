const Resenia = require('../models/Resenia.js');

const getResenias = async (req, res) => {
    try {
        const resenias = await Resenia.find().populate('reserva', 'fechaInicio');
        res.status(200).json(resenias);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createResenia = async (req, res) => {
    try {
        const { reserva, fecha, puntuacion, comentario } = req.body;
        const newResenia = await Resenia.create({ reserva, fecha, puntuacion, comentario });
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
        const resenia = await Resenia.findById(idResenia).populate('reserva', 'fechaInicio');
        res.status(200).json(resenia);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getResenias,
    createResenia,
    deleteResenia,
    getOneResenia
}