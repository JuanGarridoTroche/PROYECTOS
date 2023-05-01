
const express = require('express');
require("dotenv").config();
const {PORT} = process.env;
const cors = require("cors");
const getConnection = require("./BBDD/getConnection");

// MOCK
const itemsMock = require('./mock/items.json');

// Nos permite levantar un servidor http
const app = express();

//Nos permite conectar el front con el back
app.use(cors());

// MIDDLEWARES
// app.use('/items', ()=> {
//   console.log('MIDDLEWARES DE ITEMS');
//   next();
// })


app.get('/', (req, res) => {
  res.send('Inicio');
})

//ITEMS
app.get('/items', (req, res) => {
  res.send(itemsMock);
  let connection;
  connection = getConnection();
  console.log('Conectado a BBDD');
})

app.get('/img/:imgName', (req, res) => {
  const image = req.params.imgName;
  // console.log('imageName: ', image);
  res.sendFile(`${__dirname}/img/${image}`)
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

