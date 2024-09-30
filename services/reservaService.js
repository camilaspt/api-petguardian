const Reserva = require("../models/Reserva");
const Turno = require("../models/Turno");

// Función para obtener todas las reservas con sus turnos
const getReservas = async () => {
  try {
    const reservas = await Reserva.find()
      .populate("cliente", "nombre")
      .populate("cuidador", "nombre")
      .populate("estado", "estado")
      .select("fechaInicio fechaFin contadorTurnos tarifaTurno");

    const reservasConTurnos = await Promise.all(
      reservas.map(async (reserva) => {
        const turnos = await Turno.find({ reserva: reserva._id }).select(
          "fechaHoraInicio"
        );
        const precio = reserva.contadorTurnos * reserva.tarifaTurno;
        return {
          ...reserva.toObject(),
          precio,
          turnos: turnos.map((turno) => turno.fechaHoraInicio),
        };
      })
    );
    

    return reservasConTurnos;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  getReservas,
};