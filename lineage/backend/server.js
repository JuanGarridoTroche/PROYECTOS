
const morgan = require('morgan');
const express = require('express');
require('dotenv').config();
const {BACK_PORT, BACK_HOST} = process.env;

const app = express();

//MIDDLEWARE - Logger morgan: muestra cualquier petición al servidor a través de nuestro terminal de node
app.use(morgan('dev'));



/*
 * ###########################
 * ## Middleware de /users  ##
 * ###########################
 */


app.get('/users');

// SERVER LISTENING
app.listen(BACK_PORT, () => {
  console.log(`Server listening at http://${BACK_HOST}:${BACK_PORT}`);
})