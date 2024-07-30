const Turno = require('../models/Turno.js');

const getTurnos = async (req, res) => {
    try { 
        const turno = await Turno.find();
        res.status(200).json(turno);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createTurno = async (req, res) => {
    try {
        const { fechaHoraInicio } = req.body;
        const newTurno = await Turno.create({fechaHoraInicio});
        res.status(201).json(newTurno);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const deleteTurno = async (req, res) => {
    try {
        const idTurno = req.params.id;
        const result = await Turno.deleteOne({_id:idTurno});
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getTurnos,
    createTurno,
    deleteTurno
}