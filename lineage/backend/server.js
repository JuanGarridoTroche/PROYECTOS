const express = require('express');
require('dotenv').config();
const {BACK_PORT, BACK_HOST} = process.env;

const app = express();



// SERVER LISTENING
app.listen(BACK_PORT, () => {
  console.log(`Server listening at http://${BACK_HOST}:${BACK_PORT}`);
})