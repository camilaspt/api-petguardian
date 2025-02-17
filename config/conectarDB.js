const mongoose = require("mongoose");
require("dotenv").config();

// Conectar a MongoDB
conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos", error);
  }
}

module.exports = {conectarDB};