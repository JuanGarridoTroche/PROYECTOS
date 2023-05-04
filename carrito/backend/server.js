
const express = require('express');
require("dotenv").config();
const {PORT} = process.env;
const cors = require("cors");
const getConnection = require("./BBDD/getConnection");



// Nos permite levantar un servidor http
const app = express();

//MOCK
// const itemsMock = require('./mock/items.json');

// MIDDLEWARES (app.use)

// Middleware que nos permite conectar el front con el back
app.use(cors());
// Middleware que nos permite parsear los datos de un json
app.use(express.json());

//IMPORT ROUTES
const itemsRoutes = require('./routes/items');
const imgRoutes = require('./routes/img');


// MIDDLEWARES
app.use('/items', itemsRoutes);
app.use('/img', imgRoutes);


app.get('/', (req, res) => {
  res.send({
    status: 'Ok',
    message: 'Inicio',
  });
})

//ITEMS
app.get('/items', (req, res) => {
  res.send(itemsMock);
  let connection;
  connection = getConnection();
  console.log('Conectado a BBDD MongoDB');
})


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

