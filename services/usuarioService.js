const Usuario = require('../models/Usuario.js');
const passwordService = require('./passwordService.js');
//con este formato va a venir el usuario
// usuario = {
//     "email": "test@mail.com",
//     "password": "123456",
//     "nombre": "test",
//     "apellido": "test",
//     "cuidador": false,
// }

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
};

module.exports = {
  crearUsuario,
  cambiarRolUsuario
};