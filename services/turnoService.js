const Turno = require("../models/Turno.js");
const Disponibilidad = require("../models/DisponibilidadCuidador.js");
const moment = require("moment-timezone");

// Función para obtener la disponibilidad de un cuidador en un rango de fechas en zona horaria argentina
  // Uso en el Front: cuando el cliente sellecciona el icono de reserva en la trajeta de cuidador y selecciona las fechas, este método te devuelve un array de horas disponibles,
  // que se obtiene cruzando tanto la dispobilidad del cuidador como los turnos de las reservas que tiene el cuidador
const getDisponibilidadCuidador = async (cuidadorId, fechaInicio, fechaFin) => {
  try {
      const diasSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ];

    // Convertir las fechas a UTC
    let startDate = moment
      .tz(fechaInicio, "America/Argentina/Buenos_Aires")
      .startOf("day")
      .utc();
    let endDate = moment
      .tz(fechaFin, "America/Argentina/Buenos_Aires")
      .endOf("day")
      .utc();

    // Verificar que fechaInicio sea anterior a fechaFin
    if (startDate.isAfter(endDate)) {
      throw new Error("La fecha de inicio debe ser anterior a la fecha de fin");
    }

    const disponibilidadPorDia = {};

    // Iterar sobre cada día en el rango de fechas
    for (
      let date = startDate.clone();
      date.isSameOrBefore(endDate);
      date.add(1, "days")
    ) {
      const diaSemana = diasSemana[date.day()];
    
      // Obtener la disponibilidad del cuidador para el día específico
      const disponibilidad = await Disponibilidad.find({
        cuidador: cuidadorId,
        dia: diaSemana,
      });

      if (disponibilidad.length) {
        disponibilidadPorDia[diaSemana] = disponibilidad
          .map((slot) => {
            const horaInicio = parseInt(slot.horaInicio.split(":")[0], 10);
            const horaFin = parseInt(slot.horaFin.split(":")[0], 10);
            const horas = [];
            for (let hora = horaInicio; hora < horaFin; hora++) {
              horas.push(hora);
            }
            return horas;
          })
          .flat();
      }
    }

    const { getReservasCuidadorEnRango } = require("./reservaService.js");

    // Obtener las reservas del cuidador en el rango de fechas
    const reservas = await getReservasCuidadorEnRango(
      cuidadorId,
      startDate.toDate(),
      endDate.toDate()
    );

    // Obtener los turnos de las reservas
    const turnos = await Turno.find({
      reserva: { $in: reservas.map((r) => r._id) },
    });

    // Verificar superposición de turnos
    turnos.forEach((turno) => {
      const turnoFecha = moment(turno.fechaHoraInicio).tz(
        "America/Argentina/Buenos_Aires"
      );
      const diaSemana = diasSemana[turnoFecha.day()];
      const horaInicioTurno = turnoFecha.hours();

      if (disponibilidadPorDia[diaSemana]) {
        disponibilidadPorDia[diaSemana] = disponibilidadPorDia[
          diaSemana
        ].filter((hora) => hora !== horaInicioTurno);
      }
    });

    // Encontrar la intersección de horas disponibles en todos los días del rango
    const diasEnRango = [];
    for (
      let date = startDate.clone();
      date.isSameOrBefore(endDate);
      date.add(1, "days")
    ) {
      diasEnRango.push(diasSemana[date.day()]);
    }

    let horasFinales = [];
    if (diasEnRango.length > 0) {
      horasFinales = disponibilidadPorDia[diasEnRango[0]] || [];
      for (let i = 1; i < diasEnRango.length; i++) {
        const dia = diasEnRango[i];
        const horasDia = disponibilidadPorDia[dia] || [];
        horasFinales = horasFinales.filter((hora) => horasDia.includes(hora));
      }
    }

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

module.exports = {
  getDisponibilidadCuidador,
};
