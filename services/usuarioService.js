const Usuario = require('../models/Usuario.js');
const passwordService = require('./passwordService.js');
const Resenia = require("../models/Resenia.js");
//con este formato va a venir el usuario
// usuario = {
//     "email": "test@mail.com",
//     "password": "123456",
//     "nombre": "test",
//     "apellido": "test",
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
}
// Función para cambiar el rol de un usuario Cuidador Pendiente a Cuidador Habilitado o Cuidador No habilitado
const cambiarRolUsuario = async (userId, nuevoRol) => {
  try {
    const rolesValidos = ["Cuidador Habilitado", "Cuidador No Habilitado"];
    if (!rolesValidos.includes(nuevoRol)) {
      throw new Error("Rol no válido.");
    }

    const usuario = await Usuario.findById(userId);
    if (!usuario || usuario.rol !== "Cuidador Pendiente") {
      throw new Error("Usuario no encontrado o no es un Cuidador Pendiente.");
    }

    usuario.rol = nuevoRol;
    await usuario.save();

    return { message: "Rol del usuario actualizado correctamente." };
  } catch (error) {
    throw new Error(error.message);
  }
}
const obtenerClientesConReservasPorEstado = async () => {
  try {
    const clientes = await Usuario.aggregate([
      { $match: { rol: "Cliente" } },
      {
        $lookup: {
          from: "reservas", // Nombre de la colección de reservas
          localField: "_id",
          foreignField: "cliente", // Campo en la colección de reservas que referencia al cliente
          as: "reservas",
        },
      },
      {
        $lookup: {
          from: "estados", // Nombre de la colección de estados
          localField: "reservas.estado",
          foreignField: "_id",
          as: "estadoDetalles",
        },
      },
      {
        $addFields: {
          reservasCanceladas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Cancelada"] },
              },
            },
          },
          reservasFinalizadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Finalizada"] },
              },
            },
          },
          reservasAprobadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Aprobada"] },
              },
            },
          },
          reservasPendientes: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Pendiente"] },
              },
            },
          },
          reservasNoAprobadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "No aprobada"] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          reservasTotales: {
            $sum: [
              "$reservasCanceladas",
              "$reservasFinalizadas",
              "$reservasAprobadas",
              "$reservasPendientes",
              "$reservasNoAprobadas",
            ],
          },
        },
      },
      {
        $project: {
          nombre: 1,
          apellido: 1,
          email: 1,
          telefono: 1,
          reservasCanceladas: 1,
          reservasFinalizadas: 1,
          reservasAprobadas: 1,
          reservasPendientes: 1,
          reservasNoAprobadas: 1,
          reservasTotales: 1,
        },
      },
    ]);

    return { clientes };
  } catch (error) {
    throw new Error(error.message);
  }
};
const obtenerCuidadoresConReservasPorEstado = async () => {
  try {
    const cuidadores = await Usuario.aggregate([
      {
        $match: {
          rol: {
            $in: [
              "Cuidador Pendiente",
              "Cuidador No Habilitado",
              "Cuidador Habilitado",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "reservas", // Nombre de la colección de reservas
          localField: "_id",
          foreignField: "cuidador", // Campo en la colección de reservas que referencia al cuidador
          as: "reservas",
        },
      },
      {
        $lookup: {
          from: "estados", // Nombre de la colección de estados
          localField: "reservas.estado",
          foreignField: "_id",
          as: "estadoDetalles",
        },
      },
      {
        $addFields: {
          reservasCanceladas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Cancelada"] },
              },
            },
          },
          reservasFinalizadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Finalizada"] },
              },
            },
          },
          reservasAprobadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Aprobada"] },
              },
            },
          },
          reservasPendientes: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Pendiente"] },
              },
            },
          },
          reservasNoAprobadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "No aprobada"] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          reservasTotales: {
            $sum: [
              "$reservasCanceladas",
              "$reservasFinalizadas",
              "$reservasAprobadas",
              "$reservasPendientes",
              "$reservasNoAprobadas",
            ],
          },
          promedioPuntuacion: { $avg: "$reservas.puntuacion" },
        },
      },
      {
        $project: {
          nombre: 1,
          apellido: 1,
          email: 1,
          telefono: 1,
          promedioPuntuacion: 1,
          reservasCanceladas: 1,
          reservasFinalizadas: 1,
          reservasAprobadas: 1,
          reservasPendientes: 1,
          reservasNoAprobadas: 1,
          reservasTotales: 1,
        },
      },
    ]);

    return { cuidadores };
  } catch (error) {
    throw new Error(error.message);
  }
};
const calcularPromedioPuntuacion = async (cuidadorId, nuevaPuntuacion) => {
  try {
    // Obtener todas las reseñas del cuidador
    const resenias = await Resenia.find({ cuidador: cuidadorId });
    console.log("Reseñas encontradas:", resenias);

    // Calcular el total de puntuaciones incluyendo la nueva puntuación
    const totalPuntuacion =
      resenias.reduce((total, resenia) => total + resenia.puntuacion, 0) +
      nuevaPuntuacion;
    console.log("Total de puntuaciones:", totalPuntuacion);

    // Calcular el promedio de puntuaciones incluyendo la nueva reseña
    const promedio = totalPuntuacion / (resenias.length + 1);
    console.log("Promedio de puntuaciones calculado:", promedio);

    return promedio;
  } catch (error) {
    console.error("Error al calcular el promedio de puntuaciones:", error);
    throw new Error("No se pudo calcular el promedio de puntuaciones");
  }
};



module.exports = {
  crearUsuario,
  cambiarRolUsuario,
  obtenerClientesConReservasPorEstado,
  obtenerCuidadoresConReservasPorEstado,
  calcularPromedioPuntuacion,
};