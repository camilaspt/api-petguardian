
const express = require('express'); 
const connection = require('./config/conectarDB.js');
const cors = require('cors');
const port = process.env.PORT || 3000;
const router = require('./routes/routes.js');


connection.conectarDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(router); 


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

