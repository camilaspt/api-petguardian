
const express = require("express");
const conectarDB = require('./config/conectarDB.js');
const app = express();
const port = process.env.PORT || 3000;
const usuarioRoutes = require('./routes/usuarioRoutes.js');

conectarDB();

app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.use('/api/usuarios', usuarioRoutes);
