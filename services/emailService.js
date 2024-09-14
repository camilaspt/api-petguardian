const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Se puede usar otros servicios como 'yahoo', 'hotmail', etc.
    auth: {
        user: 'petguardian.notifications@gmail.com',
        pass: 'Zeballos1341'
    }
});

// Función para enviar correos electrónicos
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'petguardian.notifications@gmail.com',
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

module.exports = { sendEmail };