const Usuario = require('../models/Usuario.js');
const service = require('../services/usuarioService.js');
const passwordService = require('../services/passwordService.js');
const tokenAuthService = require('../services/tokenAuthService.js');
const mail = require('../services/emailService.js');

const createNewUser = async (req, res) => {
    try {
        const user = await service.crearUsuario(req.body);
        mail.sendEmailNewUser(user.email, user.rol);
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
        const user = await Usuario.findOne({email: email, eliminado: false});
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
        const result = await Usuario.updateOne({_id:idUser}, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getCuidadoresHabilitados = async (req, res) => {
    try {
        const users = await Usuario.find({rol: "Cuidador Habilitado", eliminado: false}).select('nombre apellido telefono email descripcionPersonal tarifaHora promedioPuntuacion');
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getCuidadoresPendientes = async (req, res) => {
    try {
        const users = await Usuario.find({
          rol: "Cuidador Pendiente",
          eliminado: false,
        }).select(
          "nombre apellido telefono email domicilio");
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getOneUser = async (req, res) => {
    try {
        const idUser = req.params.id;
        const user = await Usuario.findOne({_id:idUser, eliminado: false});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const cambiarRol = async (req, res) => {
  const {userId, nuevoRol } = req.body;

  try {
    const resultado = await service.cambiarRolUsuario(userId, nuevoRol);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
const getClientesConReservasPorEstado = async (req, res) => {
  try {
    const resultado = await service.obtenerClientesConReservasPorEstado();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCuidadoresConReservasPorEstado = async (req, res) => {
  try {
    const { cuidadores } =
      await service.obtenerCuidadoresConReservasPorEstado();
    res.status(200).json(cuidadores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNewUser,
  getUsers,
  login,
  deleteUser,
  editUser,
  getCuidadoresHabilitados,
  getCuidadoresPendientes,
  getOneUser,
  cambiarRol,
  getClientesConReservasPorEstado,
  getCuidadoresConReservasPorEstado
};