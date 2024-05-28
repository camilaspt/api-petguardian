const Mascota = require('../models/Mascota.js');

const getMascotas = async (req, res) => {
    try {
        const mascotas = await Mascota.find();
        res.status(200).json(mascotas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createMascota = async (req, res) => {
    try {
        const { nombre, tipoMascota, etapaVida, obsComida, obsEnfermedades, obsOtros } = req.body;
        const newMascota = await Mascota.create({ nombre, tipoMascota, etapaVida, obsComida, obsEnfermedades, obsOtros });
        res.status(201).json(newMascota);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteMascota = async (req, res) => {
    try {
        const idMascota = req.params.id;
        const result = await Mascota.deleteOne({_id:idMascota});
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const editMascota = async (req, res) => {
    try {
        const idMascota = req.params.id;
        const { nombre, tipoMascota, etapaVida, obsComida, obsEnfermedades, obsOtros } = req.body;
        const result = await Mascota.updateOne({_id:idMascota}, { nombre, tipoMascota, etapaVida, obsComida, obsEnfermedades, obsOtros });
        res.status(200).json(result);
    }   catch (error) {
        res.status(400).json({ message: error.message });
    } 
}

const getMascotasPorUsuario = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const mascotas = await Mascota.find({usuario: idUsuario});
        res.status(200).json(mascotas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getOneMascota = async (req, res) => {
    try {
        const idMascota = req.params.id;
        const mascota = await Mascota.findById(idMascota);
        res.status(200).json(mascota);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getMascotas,
    createMascota,
    deleteMascota,
    editMascota,
    getMascotasPorUsuario,
    getOneMascota
}
