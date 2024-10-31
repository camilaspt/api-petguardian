const moment = require("moment-timezone");
const Reserva = require("../models/Reserva.js");
const Turno = require("../models/Turno");
const Usuario = require("../models/Usuario.js");
const Estado = require("../models/Estado.js");
const mongoose = require("mongoose");

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
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Crear turnos para cada día
    for (let i = 0; i < days; i++) {
      const turnoDate = new Date(startDate);
      turnoDate.setDate(turnoDate.getDate() + i);
      turnoDate.setHours(
        parseInt(horaTurno.split(":")[0]),
        parseInt(horaTurno.split(":")[1]),
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
const getReservas = async ({
  search,
  estado,
  fechaInicio,
  fechaFin,
  precio,
}) => {
  try {
    const query = {};

    if (search) {
      const usuarios = await Usuario.find({
        nombre: { $regex: search, $options: "i" },
      }).select("_id");
      const usuarioIds = usuarios.map((usuario) => usuario._id);
      const estados = await Estado.find({
        estado: { $regex: search, $options: "i" },
      }).select("_id");
      const estadoIds = estados.map((estado) => estado._id);
      const fechaInicioUTC = moment
        .tz(search, "America/Argentina/Buenos_Aires")
        .isValid()
        ? moment.tz(search, "America/Argentina/Buenos_Aires").utc().toDate()
        : null;
      const fechaFinUTC = moment
        .tz(search, "America/Argentina/Buenos_Aires")
        .isValid()
        ? moment.tz(search, "America/Argentina/Buenos_Aires").utc().toDate()
        : null;
      const precio = parseFloat(search);

      query.$or = [
        { cliente: { $in: usuarioIds } },
        { cuidador: { $in: usuarioIds } },
        { estado: { $in: estadoIds } },
        { fechaInicio: { $gte: fechaInicioUTC } },
        { fechaFin: { $lte: fechaFinUTC } },
      ];

      if (!isNaN(precio)) {
        query.$or.push({ tarifaTurno: precio });
      }

      // Verificar si el search es un año
      const year = parseInt(search, 10);
      if (!isNaN(year)) {
        const startOfYear = moment
          .tz(`${year}-01-01`, "America/Argentina/Buenos_Aires")
          .startOf("year")
          .utc()
          .toDate();
        const endOfYear = moment
          .tz(`${year}-12-31`, "America/Argentina/Buenos_Aires")
          .endOf("year")
          .utc()
          .toDate();
        query.$or.push({ fechaInicio: { $gte: startOfYear, $lte: endOfYear } });
        query.$or.push({ fechaFin: { $gte: startOfYear, $lte: endOfYear } });
      }
    }

    if (estado) {
      const estadoDoc = await Estado.findOne({ estado });
      if (estadoDoc) {
        query.estado = estadoDoc._id;
      }
    }

    if (fechaInicio && fechaFin) {
      const fechaInicioUTC = moment
        .tz(fechaInicio, "America/Argentina/Buenos_Aires")
        .utc()
        .toDate();
      const fechaFinUTC = moment
        .tz(fechaFin, "America/Argentina/Buenos_Aires")
        .utc()
        .toDate();
      query.fechaInicio = { $gte: fechaInicioUTC };
      query.fechaFin = { $lte: fechaFinUTC };
    }

    const reservas = await Reserva.find(query)
      .populate("cliente", "nombre")
      .populate("cuidador", "nombre")
      .populate("estado", "estado")
      .select("fechaInicio fechaFin contadorTurnos tarifaTurno");

    const reservasConTurnos = await Promise.all(
      reservas.map(async (reserva) => {
        const turnos = await Turno.find({ reserva: reserva._id }).select(
          "fechaHoraInicio"
        );
        const precioCalculado = reserva.contadorTurnos * reserva.tarifaTurno;
        return {
          ...reserva.toObject(),
          fechaInicio: moment(reserva.fechaInicio)
            .tz("America/Argentina/Buenos_Aires")
            .format(),
          fechaFin: moment(reserva.fechaFin)
            .tz("America/Argentina/Buenos_Aires")
            .format(),
          precio: precioCalculado,
          turnos: turnos.map((turno) =>
            moment(turno.fechaHoraInicio)
              .tz("America/Argentina/Buenos_Aires")
              .format()
          ),
        };
      })
    );

    // Filtrar por precio después de calcularlo
    const reservasFiltradasPorPrecio = precio
      ? reservasConTurnos.filter(
          (reserva) => reserva.precio === parseFloat(precio)
        )
      : reservasConTurnos;

    return reservasFiltradasPorPrecio;
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    throw new Error("Error al obtener reservas, trate de nuevo después.");
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
module.exports = {
  getReservas,
  createReserva,
  getReservasCuidadorEnRango,
};
