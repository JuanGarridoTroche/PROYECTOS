const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const {HOST, PORT} = process.env;

// 
const app = express();

// Monitorización de datos en tiempo real
app.use(morgan("dev"));



// Servidor escuchando en el puerto "PORT"
app.listen(PORT, ()=> {
    console.log(`Server listening at ${HOST}:${PORT}`);
})