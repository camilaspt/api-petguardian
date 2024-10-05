const turnoService = require("../services/turnoService.js");
const Turno = require("../models/Turno.js");

const getTurnos = async (req, res) => {
  try {
    const turno = await Turno.find();
    res.status(200).json(turno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createTurno = async (req, res) => {
  try {
    const { fechaHoraInicio, reserva } = req.body;
    const newTurno = await Turno.create({ fechaHoraInicio, reserva });
    res.status(201).json(newTurno);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

const deleteTurno = async (req, res) => {
  try {
    const idTurno = req.params.id;
    const result = await Turno.deleteOne({ _id: idTurno });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Función para obtener la disponibilidad de un cuidador en un rango de fechas en zona horaria argentina
  // Uso en el Front: cuando el cliente sellecciona el icono de reserva en la trajeta de cuidador y selecciona las fechas, este método te devuelve un array de horas disponibles,
  // que se obtiene cruzando tanto la dispobilidad del cuidador como los turnos de las reservas que tiene el cuidador
const getDisponibilidadCuidador = async (req, res) => {
  try {
    const { cuidadorId, fechaInicio, fechaFin } = req.body;

    const disponibilidad = await turnoService.getDisponibilidadCuidador(
      cuidadorId,
      fechaInicio,
      fechaFin
    );
    res.status(200).json(disponibilidad);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTurnos,
  createTurno,
  deleteTurno,
  getDisponibilidadCuidador,
};
