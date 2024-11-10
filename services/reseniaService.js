const Resenia = require("../models/Resenia.js");
const Usuario = require("../models/Usuario.js");
const usuarioService = require("../services/usuarioService");
const Reserva = require("../models/Reserva.js");

const createResenia = async (data) => {
  try {
    // Crear la nueva reseña utilizando los atributos requeridos del modelo
    const newResenia = await Resenia.create(data);

    // Obtener la reserva para acceder al cuidador
    const reserva = await Reserva.findById(data.reserva);
    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }

    // Obtener el cuidador desde la reserva
    const cuidador = reserva.cuidador;

    // Calcular el nuevo promedio de puntuaciones incluyendo la nueva puntuación
    const promedioPuntuacion = await usuarioService.calcularPromedioPuntuacion(
      cuidador,
      data.puntuacion
    );
    console.log("Nuevo promedio de puntuaciones:", promedioPuntuacion);

    // Actualizar el promedio de puntuaciones del cuidador
    const result = await Usuario.findByIdAndUpdate(
      cuidador,
      { promedioPuntuacion },
      { new: true }
    );
    if (!result) {
      throw new Error(
        "No se pudo actualizar el promedio de puntuaciones del cuidador"
      );
    }

    //Actualizar la resenia en la reserva
    reserva.resenia = newResenia._id;
    await reserva.save();
    
    console.log("Resultado de la actualización:", result);

    return newResenia;
  } catch (error) {
    console.error("Error al crear la reseña:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  createResenia,
};
