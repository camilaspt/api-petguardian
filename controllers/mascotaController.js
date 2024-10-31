const Mascota = require('../models/Mascota.js');
const service = require('../services/mascotaService.js');

const getMascotas = async (req, res) => {
    try {
        const mascotas = await Mascota.find({eliminado: false}).populate('usuario', 'nombre').populate('tipoMascota', 'nombre').populate('etapaVida', 'nombre');
        res.status(200).json(mascotas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createMascota = async (req, res) => {
    try {
        console.log(req.body);
        const newMascota = await service.crearMascota(req.body);
        res.status(201).json(newMascota);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteMascota = async (req, res) => {
    try {
        const idMascota = req.params.id;
        const result = await Mascota.updateOne({_id:idMascota}, { eliminado: true });
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
        const mascotas = await Mascota.find({usuario: idUsuario, eliminado: false}).populate('usuario', 'nombre').populate('tipoMascota', 'nombre').populate('etapaVida', 'nombre');
        res.status(200).json(mascotas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getOneMascota = async (req, res) => {
    try {
        const idMascota = req.params.id;
        const mascota = await Mascota.findOne({_id:idMascota, eliminado: false} ).populate('usuario', 'nombre').populate('tipoMascota', 'nombre').populate('etapaVida', 'nombre');
        res.status(200).json(mascota);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const guardarImagenMascota = async (req, res) => {
    try {
        const urlImagen = req.file.path; // URL de la imagen en Cloudinary
        const mascotaId = req.params.id;
        // Actualizar el usuario con la URL de la imagen
        const mascota = await Mascota.findByIdAndUpdate(
            mascotaId,
          { urlImagen: urlImagen },
          { new: true }
        );
        res.status(200).json({ message: "Imagen cargada exitosamente", mascota });
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al cargar la imagen", error });
      }
}

module.exports = {
    getMascotas,
    createMascota,
    deleteMascota,
    editMascota,
    getMascotasPorUsuario,
    getOneMascota,
    guardarImagenMascota
}
