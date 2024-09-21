const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Se puede usar otros servicios como 'yahoo', 'hotmail', etc. por si queremos cambiar el mail.
    auth: {
        user: 'petguardian.notifications@gmail.com', //contraseña : Zeballos1341
        pass: 'hkyo zezq mjfe bglz' //contraseña de aplicacion: hkyo zezq mjfe bglz
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
const sendEmailState = (email, estado) => {
    const mailOptions = {
        from: '"PetGuardian" <petguardian.notifications@gmail.com>',
        to: email, // Destinatario
        subject: 'Una de tus Reservas cambio de Estado',
        text: `El estado de tu reserva ha cambiado a: ${estado}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};

const sendEmailNewUser = (email, rol) => {
    const mailOptions = {
        from: '"PetGuardian" <petguardian.notifications@gmail.com>',
        to: email, // Destinatario
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