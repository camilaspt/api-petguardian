const reservaService = require('../services/reservaService');
const cron = require('node-cron');

const programarUpdateReservas = () => {
    console.log('Programando actualización de reservas');
    cron.schedule('*/1 * * * *', () => {
        reservaService.updateReservasFinalizadas();
    });
};

module.exports = { programarUpdateReservas };