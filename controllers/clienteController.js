const Cliente = require ("../models/Cliente.js");
const Usuario = require('../models/Usuario.js');


const createCliente = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, password, domicilio, contactoEmergencia, nombreContactoEmergencia } = req.body;

        let usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const usuario = new Usuario({ nombre,apellido, telefono, email, password, domicilio, rol: 'cliente' });
        const newUsuario = await usuario.save();
        
        const cliente = new Cliente({ usuario: newUsuario._id, contactoEmergencia, nombreContactoEmergencia });
        const newCliente = await cliente.save();
        res.status(201).json(newCliente);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
}

const getClientes = async (req, res) => {
    try { 
      const cliente = await Cliente.find().populate('usuario');
      res.status(200).json(cliente);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
}

module.exports = {
getClientes,
createCliente
}