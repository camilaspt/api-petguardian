const nodemailer = require('nodemailer');
const Reserva = require('../models/Reserva.js');
const Estado = require('../models/Estado.js');
const Usuario = require('../models/Usuario.js');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL
    }
});
// Función para enviar correos electrónicos de cambio de estado de reserva.
const sendEmailState = async (reserva) => {
    const cliente = await Usuario.findById(reserva.cliente);
    const cuidador = await Usuario.findById(reserva.cuidador);
    const emails = [cliente.email, cuidador.email];
    const estado = await Estado.findById(reserva.estado);
    const numeroReserva = reserva.numeroReserva;
 
    const mailOptions = {
        from: '"PetGuardian" <petguardian.notifications@gmail.com>',
        to: emails.join(', '),
        subject: 'Una de tus Reservas cambio de Estado',
        text: `La reserva ${numeroReserva} cambio al estado: ${estado}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};
// Función para enviar correos electrónicos de nuevo usuario.
const sendEmailNewUser = (email, rol) => {
    const mailOptions = {
        from: '"PetGuardian" <petguardian.notifications@gmail.com>',
        to: email,
        subject: 'Bienvenido a PetGuardian', 
        text: `Felicitaciones!!! Ahora sos ${rol} en PetGuardian.` 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};

module.exports = {  
    sendEmailState,
    sendEmailNewUser 
};