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

const obtenerClientesConReservasPorEstado = async (filtros) => {
  try {
    const { nombre, apellido, email, reservasMin, reservasMax } = filtros;

    const matchStage = { rol: "Cliente" };

    if (nombre) matchStage.nombre = { $regex: nombre, $options: "i" };
    if (apellido) matchStage.apellido = { $regex: apellido, $options: "i" };
    if (email) matchStage.email = { $regex: email, $options: "i" };

    const clientes = await Usuario.aggregate([
      { $match: matchStage },
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
        $match: {
          ...(reservasMin !== undefined && {
            reservasTotales: { $gte: reservasMin },
          }),
          ...(reservasMax !== undefined && {
            reservasTotales: { $lte: reservasMax },
          }),
        },
      },
      {
        $project: {
          createdAt: {
            $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
          },
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

    // Obtener estadísticas
    const totalClientes = await Usuario.countDocuments({ rol: "Cliente" });
    const clientesFiltrados = clientes.length;
    const clientes1a10 = await Usuario.aggregate([
      { $match: { rol: "Cliente" } },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "cliente",
          as: "reservas",
        },
      },
      {
        $addFields: {
          reservasTotales: { $size: "$reservas" },
        },
      },
      {
        $match: { reservasTotales: { $gte: 1, $lte: 10 } },
      },
      { $count: "count" },
    ]);
    const clientes11a20 = await Usuario.aggregate([
      { $match: { rol: "Cliente" } },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "cliente",
          as: "reservas",
        },
      },
      {
        $addFields: {
          reservasTotales: { $size: "$reservas" },
        },
      },
      {
        $match: { reservasTotales: { $gte: 11, $lte: 20 } },
      },
      { $count: "count" },
    ]);
    const clientes21a50 = await Usuario.aggregate([
      { $match: { rol: "Cliente" } },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "cliente",
          as: "reservas",
        },
      },
      {
        $addFields: {
          reservasTotales: { $size: "$reservas" },
        },
      },
      {
        $match: { reservasTotales: { $gte: 21, $lte: 50 } },
      },
      { $count: "count" },
    ]);
    const clientes51a100 = await Usuario.aggregate([
      { $match: { rol: "Cliente" } },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "cliente",
          as: "reservas",
        },
      },
      {
        $addFields: {
          reservasTotales: { $size: "$reservas" },
        },
      },
      {
        $match: { reservasTotales: { $gte: 51, $lte: 100 } },
      },
      { $count: "count" },
    ]);

    return {
      clientes,
      estadisticas: {
        totalClientes,
        clientesFiltrados,
        clientes1a10: clientes1a10[0] ? clientes1a10[0].count : 0,
        clientes11a20: clientes11a20[0] ? clientes11a20[0].count : 0,
        clientes21a50: clientes21a50[0] ? clientes21a50[0].count : 0,
        clientes51a100: clientes51a100[0] ? clientes51a100[0].count : 0,
      },
    };

  } catch (error) {
    throw new Error(error.message);
  }
};
const obtenerCuidadoresConReservasPorEstado = async (filtros) => {
  try {
    const { nombre, apellido, email, estado } = filtros;

    const matchStage = {
      rol:{ $in: [
        "Cuidador Habilitado" ,
        "Cuidador No Habilitado" ,
        "Cuidador Pendiente"
  ]}};

    if (nombre) matchStage.nombre = { $regex: nombre, $options: "i" };
    if (apellido) matchStage.apellido = { $regex: apellido, $options: "i" };
    if (email) matchStage.email = { $regex: email, $options: "i" };
  
    const cuidadores = await Usuario.aggregate([
      { $match: matchStage },
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
          estado: {
            $cond: {
              if: { $eq: ["$rol", "Cuidador Habilitado"] },
              then: "Habilitado",
              else: {
                $cond: {
                  if: { $eq: ["$rol", "Cuidador No Habilitado"] },
                  then: "No habilitado",
                  else: {
                    $cond: {
                      if: { $eq: ["$rol", "Cuidador Pendiente"] },
                      then: "Pendiente",
                      else: "$estado", // Mantener el valor original si no coincide con ninguno
                    },
                  },
                },
              },
            },
          },
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
      ...(estado
        ? [{ $match: { estado: { $regex: estado, $options: "i" } } }]
        : []),
      {
        $project: {
          createdAt: {
            $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
          },
          nombre: 1,
          apellido: 1,
          email: 1,
          telefono: 1,
          estado: 1,
          tarifa: 1,
          promedioPuntuacion: 1,
          reservasTotales: 1,
          reservasCanceladas: 1,
          reservasFinalizadas: 1,
          reservasAprobadas: 1,
          reservasPendientes: 1,
          reservasNoAprobadas: 1,
        },
      },
    ]);

    // Obtener estadísticas
    const cuidadoresPendientes = await Usuario.countDocuments({rol: "Cuidador Pendiente"});
    const cuidadoresHabilitados = await Usuario.countDocuments({
      rol: "Cuidador Habilitado",
    });
    const cuidadoresNoHabilitados = await Usuario.countDocuments({ rol: "Cuidador No Habilitado" });

    const totalCuidadores = await Usuario.countDocuments({ rol:{$in: ["Cuidador Habilitado" ,"Cuidador No Habilitado" ,   "Cuidador Pendiente"]}});
    const puntuacionPromedioHabilitados = await Usuario.aggregate([
      {
        $match: { rol: "Cuidador Habilitado", promedioPuntuacion: { $ne: 0 } },
      },
      {
        $group: {
          _id: null,
          promedioPuntuacion: { $avg: "$promedioPuntuacion" },
        },
      },
    ]);

    const promedioPuntuacionHabilitados =
      puntuacionPromedioHabilitados.length > 0
        ? Math.round(puntuacionPromedioHabilitados[0].promedioPuntuacion * 10) /
          10
        : 0;

    const cuidadoresFiltrados = cuidadores.length;

  return {
    cuidadores,
    estadisticas: {
      cuidadoresPendientes,
      cuidadoresHabilitados,
      cuidadoresNoHabilitados,
      totalCuidadores,
      cuidadoresFiltrados,
      promedioPuntuacionHabilitados,
    },
  };
  } catch (error) {
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
    console.log("Habilitando cuidador con ID:", cuidadorId);
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
}

const desaprobarCuidador = async (cuidadorId) => {
  try {
    console.log("Desaprobando cuidador con ID:", cuidadorId);
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
}

module.exports = {
  crearUsuario,
  obtenerClientesConReservasPorEstado,
  obtenerCuidadoresConReservasPorEstado,
  calcularPromedioPuntuacion,
  habilitarCuidador,
  desaprobarCuidador
};