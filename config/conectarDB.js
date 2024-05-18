const mongoose = require("mongoose");
require("dotenv").config();

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.error("No se pudo conectar a la base de datos", err));
