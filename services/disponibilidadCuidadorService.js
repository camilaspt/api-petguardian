const DisponibilidadCuidador = require('../models/DisponibilidadCuidador.js');

const crearDisponibilidad = async (fecha, horarios, idCuidador) => {
    try {
        console.log('Horarios recibidos:', horarios);

        const horas = horarios.map(horario => {
            console.log('Procesando horario:', horario);
            return horario.horaInicio.toString();
        });

        console.log('Horas procesadas:', horas);

        const disponibilidad = {
            fecha: fecha,
            horas: horas,
            cuidador: idCuidador
        };


        const result = await DisponibilidadCuidador.create(disponibilidad);

        return result;
    } catch (error) {
        console.log('Error al crear disponibilidad:', error.message);
        throw new Error(error.message);
    }
};

const obtenerDisponibilidadesPorCuidador = async (idCuidador) => {
  try {
    const disponibilidades = await DisponibilidadCuidador.find(
      { cuidador: idCuidador },
      "fecha horas"
    );
    return disponibilidades;
  } catch (error) {
    console.log("Error al obtener disponibilidades:", error.message);
    throw new Error(error.message);
  }
};

const crearOActualizarDisponibilidad = async (fecha, horarios, idCuidador) => {
  try {
    // Buscar si ya existe una disponibilidad para el cuidador con la fecha especificada
    const disponibilidadExistente = await DisponibilidadCuidador.findOne({
      cuidador: idCuidador,
      fecha: fecha,
    });

    // Si existe, eliminarla
    if (disponibilidadExistente) {
      await DisponibilidadCuidador.deleteOne({
        _id: disponibilidadExistente._id,
      });
    }

    // Crear la nueva disponibilidad
    const horas = horarios.map((horario) => horario.horaInicio.toString());

    const nuevaDisponibilidad = {
      fecha: fecha,
      horas: horas,
      cuidador: idCuidador,
    };

    const result = await DisponibilidadCuidador.create(nuevaDisponibilidad);

    return result;
  } catch (error) {
    console.log("Error al crear o actualizar disponibilidad:", error.message);
    throw new Error(error.message);
  }
};
module.exports = {
  crearDisponibilidad,
  obtenerDisponibilidadesPorCuidador,
  crearOActualizarDisponibilidad,
};