const jwt = require('jsonwebtoken');

const createToken = (idUser) => {
    console.log('ENTRO AL METODO' + idUser);
    return jwt.sign({ id: idUser }, 'claveprueba', { expiresIn: '6h' });
}

module.exports = { createToken };