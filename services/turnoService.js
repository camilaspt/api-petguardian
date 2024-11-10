const Turno = require("../models/Turno.js");
const Disponibilidad = require("../models/DisponibilidadCuidador.js");
const moment = require("moment-timezone");

// Función para obtener la disponibilidad de un cuidador en un rango de fechas
const getDisponibilidadCuidador = async (cuidadorId, fechaInicio, fechaFin) => {
  try {
    const { getReservasCuidadorEnRango } = require("./reservaService.js");

    // Extraer la fecha en formato YYYY-MM-DD
    const fechaInicioSolo = fechaInicio.substring(0, 10);
    const fechaFinSolo = fechaFin.substring(0, 10);

    console.log(`Fecha de inicio recibida: ${fechaInicio}`);
    console.log(`Fecha de fin recibida: ${fechaFin}`);
    console.log(`Fecha de inicio (solo): ${fechaInicioSolo}`);
    console.log(`Fecha de fin (solo): ${fechaFinSolo}`);

    const [startYear, startMonth, startDay] = fechaInicioSolo
      .split("-")
      .map(Number);
    const [endYear, endMonth, endDay] = fechaFinSolo.split("-").map(Number);

    console.log(
      `Año de inicio: ${startYear}, Mes de inicio: ${startMonth}, Día de inicio: ${startDay}`
    );
    console.log(
      `Año de fin: ${endYear}, Mes de fin: ${endMonth}, Día de fin: ${endDay}`
    );

    // Crear las fechas de inicio y fin del día en UTC
    const startDate = new Date(Date.UTC(startYear, startMonth - 1, startDay));
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(Date.UTC(endYear, endMonth - 1, endDay));
    endDate.setUTCHours(23, 59, 59, 999);

    console.log(
      `Inicio de getDisponibilidadCuidador para cuidadorId: ${cuidadorId}`
    );
    console.log(
      `Rango de fechas: ${startDate.toISOString()} - ${endDate.toISOString()}`
    );

    // Verificar que fechaInicio sea anterior a fechaFin
    if (startDate > endDate) {
      throw new Error("La fecha de inicio debe ser anterior a la fecha de fin");
    }

    const disponibilidadPorFecha = {};

    // Iterar sobre cada día en el rango de fechas
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setUTCDate(date.getUTCDate() + 1)
    ) {
      const currentDate = new Date(date);
      const startOfDay = new Date(currentDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(currentDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      console.log(
        `Buscando disponibilidad para la fecha: ${currentDate
          .toISOString()
          .substring(0, 10)}`
      );
      console.log(
        `Rango de búsqueda: ${startOfDay.toISOString()} - ${endOfDay.toISOString()}`
      );

      const disponibilidad = await Disponibilidad.findOne({
        cuidador: cuidadorId,
        fecha: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      if (disponibilidad) {
        console.log(
          `Disponibilidad encontrada para la fecha: ${currentDate
            .toISOString()
            .substring(0, 10)}`
        );
        disponibilidadPorFecha[currentDate.toISOString().substring(0, 10)] =
          disponibilidad.horas.map((hora) => parseInt(hora, 10));
      } else {
        console.log(
          `No se encontró disponibilidad para la fecha: ${currentDate
            .toISOString()
            .substring(0, 10)}`
        );
      }
    }

    console.log("Disponibilidad por fecha:", disponibilidadPorFecha);

    // Obtener las reservas del cuidador en el rango de fechas
    const reservas = await getReservasCuidadorEnRango(
      cuidadorId,
      startDate,
      endDate
    );

    console.log("Reservas encontradas:", reservas);

    // Obtener los turnos de las reservas
    const turnos = await Turno.find({
      reserva: { $in: reservas.map((r) => r._id) },
    });

    console.log("Turnos encontrados:", turnos);

    // Verificar superposición de turnos
    turnos.forEach((turno) => {
      const turnoFecha = moment(turno.fechaHoraInicio);
      const fecha = turnoFecha.format("YYYY-MM-DD");
      const horaInicioTurno = turnoFecha.hours();

      if (disponibilidadPorFecha[fecha]) {
        console.log(
          `Eliminando hora ${horaInicioTurno} de la disponibilidad para la fecha: ${fecha}`
        );
        disponibilidadPorFecha[fecha] = disponibilidadPorFecha[fecha].filter(
          (hora) => hora !== horaInicioTurno
        );
      }
    });

    console.log(
      "Disponibilidad por fecha después de eliminar turnos:",
      disponibilidadPorFecha
    );

    // Encontrar la intersección de horas disponibles en todos los días del rango
    const fechasEnRango = [];
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setUTCDate(date.getUTCDate() + 1)
    ) {
      fechasEnRango.push(new Date(date).toISOString().substring(0, 10));
    }

    console.log("Fechas en rango:", fechasEnRango);

    let horasFinales = [];
    if (fechasEnRango.length > 0) {
      horasFinales = disponibilidadPorFecha[fechasEnRango[0]] || [];
      console.log(
        `Horas iniciales para la fecha ${fechasEnRango[0]}:`,
        horasFinales
      );
      for (let i = 1; i < fechasEnRango.length; i++) {
        const fecha = fechasEnRango[i];
        const horasFecha = disponibilidadPorFecha[fecha] || [];
        console.log(`Horas para la fecha ${fecha}:`, horasFecha);
        horasFinales = horasFinales.filter((hora) => horasFecha.includes(hora));
        console.log(
          `Horas finales después de la fecha ${fecha}:`,
          horasFinales
        );
      }
    }

    console.log("Horas finales disponibles:", horasFinales);

    if (horasFinales.length === 0) {
      return { message: "El cuidador no tiene disponibilidad para esos días" };
    }

    return horasFinales.sort((a, b) => a - b);
  } catch (error) {
    console.error(
      "Error al obtener la disponibilidad del cuidador:",
      error.message
    );
    return {
      message:
        "Error al obtener la disponibilidad del cuidador: " + error.message,
    };
  }
};
// Función para eliminar los turnos de una reserva
const deleteTurnosByReserva = async (reservaId) => {
  try {
    const result = await Turno.deleteMany({ reserva: reservaId });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getDisponibilidadCuidador,
  deleteTurnosByReserva,
};
