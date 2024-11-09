const DisponibilidadCuidador = require('../models/DisponibilidadCuidador.js');

const crearDisponibilidad = async (disponibilidad) => {
    try {
        const { dia, horaInicio, horaFin, cuidador } = disponibilidad;
//verifico que para ese dia ese cuidador no tenga disponibilidad.
        const disponibilidadExistente = await DisponibilidadCuidador.findOne({ dia, cuidador });
        if (disponibilidadExistente) {
            throw new Error('Ya existe una disponibilidad para el cuidador en el día indicado');
        }
//convierto en tipo Date las horas de inicio y fin, creo un arreglo con los turnos que vamos a crear y luego los inserto en la base de datos pero como string.
        const inicio = new Date(`1970-01-01T${horaInicio}:00.000Z`);
        const fin = new Date(`1970-01-01T${horaFin}:00.000Z`);
        const disponibilidades = [];
        for (let hora = inicio; hora < fin; hora.setHours(hora.getHours() + 1)) {
            disponibilidades.push({
                dia,
                horaInicio: hora.toISOString().substring(11, 16),
                horaFin: new Date(hora.getTime() + 60 * 60 * 1000).toISOString().substring(11, 16),
                cuidador
            });
        }
//inserto los turnos en la base de datos.
        const newDisponibilidades = await DisponibilidadCuidador.insertMany(disponibilidades);
        return newDisponibilidades;
    } catch (error) {
        throw new Error(error.message);
    }
};

const crearTurnos = async (fecha, horarios, idCuidador) => {
    try {
        console.log(horarios);

        const disponibilidades = horarios.map(horario => ({
            fecha: fecha,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            cuidador: idCuidador
        }));

        const newDisponibilidades = [];
        for (const disponibilidad of disponibilidades) {
            const result = await DisponibilidadCuidador.create(disponibilidad);
            newDisponibilidades.push(result);
        }

        return newDisponibilidades;
    } catch (error) {
        console.log(error.message); 
        throw new Error(error.message);
    }
};
module.exports = { crearDisponibilidad, crearTurnos };