const jwt = require('jsonwebtoken');
const contra = process.env.AUTH_PASS;
const createToken = (idUser) => {
    return jwt.sign({ id: idUser }, contra, { expiresIn: '6h' });
}

module.exports = { createToken };