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
        usuario.cuidador ? usuario.rol = "Cuidador" : usuario.rol = "Cliente";
        usuario.password = await passwordService.encriptPassword(usuario.password);
        const newUser = await Usuario.create(usuario);
        return newUser;
    } catch (error) {
        console.log(error)
        throw new Error(error.message);
    }
}

module.exports = {
    crearUsuario
}