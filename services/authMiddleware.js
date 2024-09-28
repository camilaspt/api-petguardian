const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
// Middleware para verificar el token JWT y extraer el ID del usuario
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, "claveprueba", (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token." });
    }
    req.userId = decoded.id; // Aquí se coloca el ID del usuario en req.userId
    next();
  });
};

// Middleware para verificar si el usuario tiene el rol de administrador
const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await Usuario.findById(userId);
    if (user && user.rol === "Administrador") {
      next();
    } else {
      res
        .status(403)
        .json({ message: "No tienes permisos para realizar esta acción." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  verifyAdmin,
  verifyToken,
};
