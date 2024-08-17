const Disponibilidad = require('../models/DisponibilidadCuidador.js');

const getDisponibilidad = async (req, res) => {
    try { 
        const disponibilidad = await Disponibilidad.find();
        res.status(200).json(disponibilidad);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createDisponibilidad = async (req, res) => {
    try {
        const { inicio, fin } = req.body;
        const newDisponibilidad = await Disponibilidad.create({inicio, fin});
        res.status(201).json(newDisponibilidad);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteDisponibilidad = async (req, res) => {
    try {
        const idDisponibilidad = req.params.id;
        const result = await Disponibilidad.deleteOne({_id:idDisponibilidad});
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getDisponibilidad,
    createDisponibilidad,
    deleteDisponibilidad
}