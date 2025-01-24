const moment = require("moment-timezone");
const Reserva = require("../models/Reserva.js");
const Turno = require("../models/Turno");
const Usuario = require("../models/Usuario.js");
const Estado = require("../models/Estado.js");
const Resenia = require("../models/Resenia.js");
const mongoose = require("mongoose");
const turnoService = require("./turnoService");
const {sendEmailState} = require('./emailService.js');


// createReserva: Crea unna reserva y sus turnos asociados
  //no valida los turnos, eso se valida en la función getDisponibilidadCuidador de turnoService, el cliente seleccionaría directamente de ese array de horas disponibles
  // Las reservas son con días consecutivos, se crea un turno de una hora para cada día al mimos horario. 
const createReserva = async ({
  fechaInicio,
  fechaFin,
  comentario,
  clienteId,
  cuidador,
  mascotas,
  horaTurno,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
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

    const savedReserva = await newReserva.save({ session });

    // Calcular la cantidad de días entre fechaInicio y fechaFin
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    const days = Math.ceil((endDate - startDate + 1000 * 60 * 60 * 24) / (1000 * 60 * 60 * 24));

    // Crear turnos para cada día
    for (let i = 0; i < days; i++) {
      const turnoDate = new Date(startDate);
      turnoDate.setDate(turnoDate.getDate() + i);
      turnoDate.setHours(
        parseInt(horaTurno),
        parseInt(horaTurno),
        0,
        0
      ); // Establecer la hora del turno

      // Crear un nuevo turno
      const newTurno = new Turno({
        fechaHoraInicio: turnoDate,
        reserva: savedReserva._id,
      });
      await newTurno.save({ session });
    }

    // Actualizar el contador de turnos en la reserva
    const updatedReserva = await Reserva.findByIdAndUpdate(
      savedReserva._id,
      { $inc: { contadorTurnos: days } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedReserva;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Función para obtener todas las reservas con sus turnos, con time zone de argentina, en la BD esta guardado con +00:00 por defecto
const getReservas = async (filtros) => {
  try {
    const estadoPendiente = await Estado.findOne({ estado: "Pendiente" })
      .select("_id")
      .lean();
    const estadoFinalizada = await Estado.findOne({ estado: "Finalizada" })
      .select("_id")
      .lean();
    const estadoAprobada = await Estado.findOne({ estado: "Aprobada" })
      .select("_id")
      .lean();
    const estadoCancelada = await Estado.findOne({ estado: "Cancelada" })
      .select("_id")
      .lean();
    const estadoNoAprobada = await Estado.findOne({ estado: "No aprobada" })
      .select("_id")
      .lean();
    const estadoAnulada = await Estado.findOne({ estado: "Anulada" })
      .select("_id")
      .lean();

    const { fechaInicio, fechaFin, nombre, estado } = filtros;

    const matchStage = {};


    const convertToDate = (dateStr) => {
      return moment(dateStr, "DD-MM-YYYY").toDate();
    };
    if (fechaInicio && fechaFin) {
      const startDate = convertToDate(fechaInicio);
      const endDate = convertToDate(fechaFin);
      if (startDate > endDate) {
        throw new Error(
          "La fechaInicio debe ser menor o igual a la fechafin."
        );
      }
    }

        if (fechaInicio && fechaFin) {
      const startDate = convertToDate(fechaInicio);
      const endDate = convertToDate(fechaFin);
      if (startDate > endDate) {
        throw new Error("La fecha de inicio debe ser menor o igual a la fecha de fin.");
      }
    }

    if (fechaInicio ) {
      const startDate = convertToDate(fechaInicio);
      matchStage.fechaInicio = { $gte: startDate };
    }

    if (fechaFin) {
      const endDate = convertToDate(fechaFin);
      if (matchStage.fechaInicio) {
        const startDate = convertToDate(fechaInicio);
        matchStage.fechaInicio = { $gte: startDate };
        matchStage.fechaFin = { $lte: endDate };
      } else {
        matchStage.fechaFin = { $lte: endDate };
      }
    }

      if (estado) {
        const estadoEncontrado = await Estado.findOne({ estado })
          .select("_id")
          .lean();
        if (!estadoEncontrado) {
          throw new Error("Estado no válido");
        }
        matchStage["estado.estado"]= estado;
      }


    console.log("MatchStage:", matchStage);
    console.log("estado:", estado);
    console.log("match estado", matchStage.estado);
    console.log("estadoPendiente", estadoPendiente._id);

    const reservas = await Reserva.aggregate([
      {
        $lookup: {
          from: "usuarios",
          localField: "cliente",
          foreignField: "_id",
          as: "cliente",
        },
      },
      { $unwind: { path: "$cliente", preserveNullAndEmptyArrays: true } },
      {
        $match: { "cliente.rol": "Cliente" },
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "cuidador",
          foreignField: "_id",
          as: "cuidador",
        },
      },
      { $unwind: { path: "$cuidador", preserveNullAndEmptyArrays: true } },
      {
        $match: { "cuidador.rol": "Cuidador Habilitado" },
      },
      {
        $lookup: {
          from: "estados",
          localField: "estado",
          foreignField: "_id",
          as: "estado",
        },
      },
      { $unwind: { path: "$estado", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "resenias",
          localField: "_id",
          foreignField: "reserva",
          as: "resenia",
        },
      },
      { $unwind: { path: "$resenia", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          precioReserva: {
            $multiply: ["$cuidador.tarifaHora", "$contadorTurnos"],
          },
          puntuacion: "$resenia.puntuacion",
          clienteNombreCompleto: {
            $concat: ["$cliente.nombre", " ", "$cliente.apellido"],
          },
          cuidadorNombreCompleto: {
            $concat: ["$cuidador.nombre", " ", "$cuidador.apellido"],
          },
        },
      },
      {
        $match: {
          ...matchStage,
          ...(nombre && {
            $or: [
              { clienteNombreCompleto: { $regex: nombre, $options: "i" } },
              { cuidadorNombreCompleto: { $regex: nombre, $options: "i" } },
              { "cliente.nombre": { $regex: nombre, $options: "i" } },
              { "cliente.apellido": { $regex: nombre, $options: "i" } },
              { "cuidador.nombre": { $regex: nombre, $options: "i" } },
              { "cuidador.apellido": { $regex: nombre, $options: "i" } },
            ],
          }),
        },
      },
      {
        $project: {
          fechaInicio: {
            $dateToString: { format: "%d-%m-%Y", date: "$fechaInicio" },
          },
          fechaFin: {
            $dateToString: { format: "%d-%m-%Y", date: "$fechaFin" },
          },
          estado: "$estado.estado",
          cliente: "$clienteNombreCompleto",
          cuidador: "$cuidadorNombreCompleto",
          contadorTurnos: 1,
          precioReserva: 1,
          puntuacion: 1,
        },
      },
    ]);

    //  estadísticas
    const totalReservas = await Reserva.countDocuments();
    const reservasFiltradas = reservas.length;
    const reservasPendientes = await Reserva.countDocuments({
      estado: estadoPendiente._id,
    });
    const reservasFinalizadas = await Reserva.countDocuments({
      estado: estadoFinalizada._id,
    });
    const reservasAprobadas = await Reserva.countDocuments({
      estado: estadoAprobada._id,
    });
    const reservasCanceladas = await Reserva.countDocuments({
      estado: estadoCancelada._id,
    });
    const reservasNoAprobadas = await Reserva.countDocuments({
      estado: estadoNoAprobada._id,
    });
    const reservasAnuladas = await Reserva.countDocuments({
      estado: estadoAnulada._id,
    });

    const totalIngresos = await Reserva.aggregate([
      {
        $lookup: {
          from: "usuarios",
          localField: "cuidador",
          foreignField: "_id",
          as: "cuidador",
        },
      },
      { $unwind: "$cuidador" },
      {
        $group: {
          _id: null,
          totalIngresos: {
            $sum: { $multiply: ["$cuidador.tarifaHora", "$contadorTurnos"] },
          },
        },
      },
    ]);

    const promedioPuntuacion = await Resenia.aggregate([
      {
        $group: {
          _id: null,
          promedioPuntuacion: { $avg: "$puntuacion" },
        },
      },
    ]);

    return {
      reservas,
      estadisticas: {
        reservasFiltradas, // o total de registros mostrados en pantalla,
        totalReservas,
        reservasPendientes,
        reservasFinalizadas,
        reservasAprobadas,
        reservasCanceladas,
        reservasNoAprobadas,
        reservasAnuladas,
        totalIngresos: totalIngresos[0] ? totalIngresos[0].totalIngresos : 0,
        promedioPuntuacion: promedioPuntuacion[0]
          ? promedioPuntuacion[0].promedioPuntuacion
          : 0,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Función para obtener las reservas de un cuidador en un rango de fechas que tengan estado Aprobada o Pendiente, se utiliza en la función getDisponibilidadCuidador de turnoService
  // devuelve las reservas del cuidador en ese rango de fechas con estado Aprobada o Pendiente.
const getReservasCuidadorEnRango = async (
  idCuidador,
  fechaInicio,
  fechaFin
) => {
  try {
    // Obtener los ObjectId de los estados "Aprobada" y "Pendiente"
    const estados = await Estado.find({
      estado: { $in: ["Aprobada", "Pendiente"] },
    });
    const estadoIds = estados.map((estado) => estado._id);
    console.log("Estado IDs:", estadoIds);

    const reservas = await Reserva.find({
      cuidador: idCuidador,
      fechaInicio: { $lte: fechaFin },
      fechaFin: { $gte: fechaInicio },
      estado: { $in: estadoIds },
    });

    return reservas;
  } catch (error) {
    throw new Error(
      "Error al obtener las reservas del cuidador: " + error.message
    );
  }
};

const updateReservasFinalizadas = async () => {
  const estadoAprobada = await Estado.findOne({ estado: "Aprobada" });
  const estadoFinalizada = await Estado.findOne({ estado: "Finalizada" });

  if (!estadoAprobada || !estadoFinalizada) {
    throw new Error("Estados 'Aprobada' o 'Finalizada' no encontrados");
  }

  const today = new Date();

  const reservasAprobadas = await Reserva.find({
    estado: estadoAprobada._id,
    fechaFin: { $lt: today },
  });

  for (const reserva of reservasAprobadas) {
    reserva.estado = estadoFinalizada._id;
    await reserva.save();
    await sendEmailState(reserva);
  }
};

const aprobarReserva = async (idReserva) => {
  try {
    const estadoAprobada = await Estado.findOne({ estado: "Aprobada" });
    if (!estadoAprobada) {
      throw new Error("Estado 'Aprobada' no encontrado");
    }

    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }

    reserva.estado = estadoAprobada._id;
    await reserva.save();
    await sendEmailState(reserva);
    return reserva;
  } catch (error) {
  throw new Error(error.message);
  }
}

const rechazarReserva = async (idReserva) => {
  try {
    const estadoNoAprobada = await Estado.findOne({ estado: "No aprobada" });
    if (!estadoNoAprobada) {
      throw new Error("Estado 'No aprobada' no encontrado");
    }

    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }

    await turnoService.deleteTurnosByReserva(idReserva);

    reserva.estado = estadoNoAprobada._id;
    await reserva.save();
    await sendEmailState(reserva);
    return reserva;
  } catch (error) {
    throw new Error(error.message);
  }
};

const anularReserva = async (idReserva) => {
  try {
    const estadoAnulada = await Estado.findOne({ estado: "Anulada" });
    if (!estadoAnulada) {
      throw new Error("Estado 'Anulada' no encontrado");
    }

    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }

    if (
      reserva.estado.toString() !==
      (await Estado.findOne({ estado: "Aprobada" }))._id.toString()
    ) {
      throw new Error("Solo se pueden anular reservas con estado 'Aprobada'");
    }

    await turnoService.deleteTurnosByReserva(idReserva);
    reserva.estado = estadoAnulada._id;
    await reserva.save();
    await sendEmailState(reserva);
    return reserva;
  } catch (error) {
    throw new Error(error.message);
  }
};

const cancelarReserva = async (idReserva) => {
  try {
    const estadoCancelada = await Estado.findOne({ estado: "Cancelada" });
    if (!estadoCancelada) {
      throw new Error("Estado 'Cancelada' no encontrado");
    }

    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }

    const estadoPendiente = await Estado.findOne({ estado: "Pendiente" });
    const estadoAprobada = await Estado.findOne({ estado: "Aprobada" });

    if (
      reserva.estado.toString() !== estadoPendiente._id.toString() &&
      reserva.estado.toString() !== estadoAprobada._id.toString()
    ) {
      throw new Error(
        "Solo se pueden cancelar reservas con estado 'Pendiente' o 'Aprobada'"
      );
    }

    await turnoService.deleteTurnosByReserva(idReserva);
    reserva.estado = estadoCancelada._id;
    await reserva.save();
    await sendEmailState(reserva);
    return reserva;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  getReservas,
  createReserva,
  getReservasCuidadorEnRango,
  updateReservasFinalizadas,
  aprobarReserva,
  rechazarReserva,
  anularReserva,
  cancelarReserva
};
