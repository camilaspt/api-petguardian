
const express = require('express');
const multer = require('multer');
const connection = require('./config/conectarDB.js');
const cors = require('cors');
const port = process.env.PORT || 3000;
const router = require('./routes/routes.js');
require('dotenv').config();

connection.conectarDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(router); 

// Configuración de multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

router.get('/', (req, res) => {
  res.send('Bienvenido a la API de PetGuardian');
});