const Mascota = require('../models/Mascota');

const crearMascota = async (mascota) => {
    try {
        const newMascota = await Mascota.create(mascota);
        return newMascota;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { crearMascota };