const Disponibilidad = require('../models/DisponibilidadCuidador.js');
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
    const idCuidador = req.userId; // Asignar el id del cuidador desde el usuario autenticado
    const disponibilidadData = { ...req.body, cuidador: idCuidador };
    const newDisponibilidad = await service.crearDisponibilidad(
      disponibilidadData
    );
    res.status(201).json(newDisponibilidad);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

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

const crearTurnos = async (req, res) => {
    try {
        const idCuidador = req.params.idCuidador;
        const disponibilidad = await service.crearTurnos(req.body.fecha, req.body.horarios, idCuidador);
        res.status(201).json(disponibilidad);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getDisponibilidadPorCuidador,
    createDisponibilidad,
    deleteDisponibilidad,
    crearTurnos
}