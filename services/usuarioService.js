const Usuario = require('../models/Usuario.js');
const passwordService = require('./passwordService.js');
const Resenia = require("../models/Resenia.js");
//con este formato va a venir el usuario
// usuario = {
//     "email": "test@mail.com",
//     "password": "123456",
//     "nombre": "test",
//     "apellido": "test",
//     "telefono": "3413453434",
//     "cuidador": false,
// }
// Función para crear un usuario
const crearUsuario = async (usuario) => {
    try {
        usuario.cuidador ? usuario.rol = "Cuidador Pendiente" : usuario.rol = "Cliente";
        usuario.password = await passwordService.encriptPassword(usuario.password);
        const newUser = await Usuario.create(usuario);
        return newUser;
    } catch (error) {
        console.log(error)
        throw new Error(error.message);
    }
};


const calcularPromedioPuntuacion = async (cuidadorId, nuevaPuntuacion) => {
  try {
    const resenias = await Resenia.find({ cuidador: cuidadorId });

    const totalPuntuacion =
      resenias.reduce((total, resenia) => total + resenia.puntuacion, 0) +
      nuevaPuntuacion;

    const promedio = totalPuntuacion / (resenias.length + 1);

    return promedio;
  } catch (error) {
    throw new Error("No se pudo calcular el promedio de puntuaciones");
  }
};

const habilitarCuidador = async (cuidadorId) => {
  try {
    const cuidador = await Usuario.findById(cuidadorId);
    if (!cuidador || cuidador.rol !== "Cuidador Pendiente") {
      throw new Error("El usuario no es un Cuidador Pendiente.");
    }

    cuidador.rol = "Cuidador Habilitado";
    await cuidador.save();

    return { message: "Cuidador habilitado correctamente." };
  } catch (error) {
    throw new Error(error.message);
  }
};

const desaprobarCuidador = async (cuidadorId) => {
  try {
     const cuidador = await Usuario.findById(cuidadorId);
    if (!cuidador || cuidador.rol !== "Cuidador Pendiente") {
      throw new Error("El usuario no es un Cuidador Pendiente.");
    }

    cuidador.rol = "Cuidador No Habilitado";
    await cuidador.save();

    return { message: "Cuidador desaprobado correctamente." };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  crearUsuario,
  calcularPromedioPuntuacion,
  habilitarCuidador,
  desaprobarCuidador
};