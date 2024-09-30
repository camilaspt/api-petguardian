const Reserva = require("../models/Reserva");
const Turno = require("../models/Turno");
const Usuario = require("../models/Usuario.js");
const Estado = require("../models/Estado.js");

const createReserva = async ({
  fechaInicio,
  fechaFin,
  comentario,
  clienteId,
  cuidador,
  mascotas,
}) => {
  try {
    const estado = await Estado.findOne({ estado: "Pendiente" });
    if (!estado) {
      throw new Error("Estado 'Pendiente' no encontrado");
    }

    const cuidadorData = await Usuario.findById(cuidador);
    if (!cuidadorData || cuidadorData.rol !== "Cuidador Habilitado") {
      throw new Error("El cuidador no está habilitado");
    }
    const tarifaTurno = cuidadorData.tarifaHora;

    const newReserva = new Reserva({
      fechaInicio,
      fechaFin,
      comentario,
      tarifaTurno,
      cliente: clienteId,
      cuidador,
      mascotas,
      estado: estado._id,
    });

    return await newReserva.save();
  } catch (error) {
    throw new Error("Error al crear la reserva: " + error.message);
  }
};

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
  createReserva,
};