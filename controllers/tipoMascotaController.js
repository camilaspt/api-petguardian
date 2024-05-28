const TipoMascota = require('../models/TipoMascota.js');

const getTiposMascota = async (req, res) => {
    try {
        const tiposMascota = await TipoMascota.find();
        res.status(200).json(tiposMascota);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createTipoMascota = async (req, res) => {
    try {
        const { nombre } = req.body;
        const newTipoMascota = await TipoMascota.create({ nombre });
        res.status(201).json(newTipoMascota);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteTipoMascota = async (req, res) => {
    try {
        const idTipoMascota = req.params.id;
        const result = await TipoMascota.deleteOne({_id:idTipoMascota});
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const editTipoMascota = async (req, res) => {
    try {
        const idTipoMascota = req.params.id;
        const { nombre } = req.body;
        const result = await TipoMascota.updateOne({_id:idTipoMascota}, { nombre });
        res.status(200).json(result);
    }   catch (error) {
        res.status(400).json({ message: error.message });
    } 
}

module.exports = {
    getTiposMascota,
    createTipoMascota,
    deleteTipoMascota,
    editTipoMascota
}