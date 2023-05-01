
const express = require('express');
require("dotenv").config();
const {PORT} = process.env;

// Nos permite levantar un servidor http
const app = express();

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
  res.send('ITEMS');
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});