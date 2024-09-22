const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'petguardian.notifications@gmail.com', //contraseña : Zeballos1341
        pass: 'hkyo zezq mjfe bglz' //contraseña de aplicacion
    }
});
// Función para enviar correos electrónicos base.
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: '"PetGuardian" <petguardian.notifications@gmail.com>',
        to: to, // Destinatario
        subject: subject, // Asunto del correo
        text: text // Cuerpo del correo
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};
// Función para enviar correos electrónicos de cambio de contraseña.
const sendEmailPassword = (email, mensaje) => {
    const mailOptions = {
        from: '"PetGuardian" <petguardian.notifications@gmail.com>',
        to: email, // Destinatario
        subject: 'Cambia tu Contraseña',
        text: mensaje // Cuerpo del correo
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};
// Función para enviar correos electrónicos de cambio de estado de reserva.
const sendEmailState = (emails, cuerpo) => {
    const [numeroReserva, estado] = cuerpo.split(','); 
    const mailOptions = {
        from: '"PetGuardian" <petguardian.notifications@gmail.com>',
        to: emails.join(', '),
        subject: 'Una de tus Reservas cambio de Estado',
        text: `La reserva ${numeroReserva} cambio al estado: ${estado}`
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
        text: `Felicitaciones!!! Ahora sos ${rol} en PetGuardian` 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};

module.exports = { 
    sendEmail, 
    sendEmailPassword, 
    sendEmailState,
    sendEmailNewUser 
};