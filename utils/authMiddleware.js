const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(403).json({ message: 'No se recibio el token de autorizacion' });
    }
    const parts = req.headers.authorization.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(403).json({ message: 'El formato del token es "Bearer {token}"' });
    }

    jwt.verify(parts[1], 'claveprueba', (err, decoded) => {
      if (err) {
        return res.status(500).json({ message: 'Error en la autenticacion del token' });
      }
      
      req.idUsuario = decoded.id;
      next();
    });
  }

module.exports = { verifyToken };