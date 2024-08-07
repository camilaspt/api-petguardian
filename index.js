
const express = require('express'); 
const connection = require('./config/conectarDB.js');
const cors = require('cors');
const port = process.env.PORT || 3000;

//Rutas de la app
const usuarioRoutes = require('./routes/usuarioRoutes.js');
const mascotaRoutes = require('./routes/mascotaRoutes.js');
const etapaVidaRoutes = require('./routes/etapaVidaRoutes.js');
const tipoMascotaRoutes = require('./routes/tipoMascotaRoutes.js');
const estadoRoutes = require ('./routes/estadoRoutes.js');
const reservaRoutes = require ('./routes/reservaRoutes.js');
const clienteRoutes = require ('./routes/clienteRoutes.js
const turnoRoutes = require ('./routes/turnoRoutes.js');

connection.conectarDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use('/api/usuarios/', usuarioRoutes);
app.use('/api/mascotas/', mascotaRoutes);
app.use('/api/etapasVida/', etapaVidaRoutes);
app.use('/api/tiposMascota/', tipoMascotaRoutes);
app.use ('/api/estados/', estadoRoutes);
app.use ('/api/reservas/', reservaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use ('/api/turnos/', turnoRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

