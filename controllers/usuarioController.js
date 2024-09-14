const Usuario = require('../models/Usuario.js');
const service = require('../services/usuarioService.js');
const passwordService = require('../services/passwordService.js');
const tokenAuthService = require('../services/tokenAuthService.js');

const createNewUser = async (req, res) => {
    try {
        const user = await service.crearUsuario(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.log("error")
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await Usuario.find({eliminado: false});
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Usuario.findOne({email: email});
        if (!user) {
            res.status(404).json({ message: 'No existe ningun usuario registrado con ese email' });
        } else {
            const matchedPasswords = await passwordService.decryptPassword(password, user.password);
            if(matchedPasswords) {
                const token =  tokenAuthService.createToken(user._id);
                res.status(200).json({mesage: 'Usuario logueado con exito', token: token, rol: user.rol, idUsuario: user._id});
            }
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
        const result = await Usuario.updateOne({_id:idUser}, { eliminado: true });
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

const getCuidadorHabilitado = async (req, res) => {
    try {
        const users = await Usuario.find({rol: {$regex: /^cuidador$/i}, habilitado: true, eliminado: false});
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getCuidadorNoHabilitado = async (req, res) => {
    try {
        const users = await Usuario.find({rol: {$regex: /^cuidador$/i}, habilitado: false, eliminado: false});
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createNewUser,
    getUsers,
    login,
    deleteUser,
    editUser,
    getCuidadorHabilitado,
    getCuidadorNoHabilitado
}