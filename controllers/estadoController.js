const Estado = require ("../models/Estado.js");

const getEstados = async (req, res) => {
    try { 
        const estado = await Estado.find();
        res.status(200).json(estado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        const newEstado = await Estado.create({estado});
        res.status(201).json(newEstado);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteEstado = async (req, res) => {
    try {
        const idEstado = req.params.id;
        const result = await Estado.deleteOne({_id:idEstado});
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
getEstados,
createEstado,
deleteEstado
}