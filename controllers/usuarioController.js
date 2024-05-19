const Usuario = require('../models/Usuario.js');

const createNewUser = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, password, domicilio, rol} = req.body;
        const newUser = await Usuario.create({ nombre, apellido, telefono, email, password, domicilio, rol: 'USUARIO', habilitado: false });

        res.status(201).json(newUser);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await Usuario.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createNewUser,
    getUsers
}