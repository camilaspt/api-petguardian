const Disponibilidad = require('../models/DisponibilidadCuidador.js');
const Cuidador = require('../models/Usuario.js');
const service = require('../services/disponibilidadCuidadorService.js');

const getDisponibilidadPorCuidador = async (req, res) => {
    try { 
        const idCuidador = req.params.idCuidador;
        const disponibilidad = await Disponibilidad.find({cuidador: idCuidador});
        res.status(200).json(disponibilidad);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createDisponibilidad = async (req, res) => {
    try {
        const newDisponibilidad = await service.crearDisponibilidad(req.body);
        res.status(201).json(newDisponibilidad);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteDisponibilidad = async (req, res) => {
    try {
        const idCuidador = req.params.idCuidador;
        const dia = req.params.dia;
        const result = await Disponibilidad.deleteMany({cuidador: idCuidador, dia: dia});
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No se encontraron disponibilidades para eliminar' });
        }
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getDisponibilidadPorCuidador,
    createDisponibilidad,
    deleteDisponibilidad
}