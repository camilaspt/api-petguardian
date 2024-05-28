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

const login = async (req, res) => {
    try {
        console.log("entro a login")
        console.log(req.body);
        const { email, password } = req.body;
        const user = await Usuario.findOne({ email, password });
        if (!user) {
            res.status(404).json({ message: 'Alguno de los datos ingresados es incorrecto' });
        } else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const idUser = req.params.id;
        const result = await Usuario.deleteOne({_id:idUser});
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const editUser = async (req, res) => {
    try {
        const idUser = req.params.id;
        const { nombre, apellido, telefono, email, password, domicilio, rol, habilitado } = req.body;
        const result = await Usuario.updateOne({_id:idUser}, { nombre, apellido, telefono, email, password, domicilio, rol, habilitado });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createNewUser,
    getUsers,
    login,
    deleteUser,
    editUser
}