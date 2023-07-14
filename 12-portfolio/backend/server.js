const express = require('express');




const app = express();


//Levantamos el servidor en el puerto
app.listen(4000, ()=> {
  console.log("Server listening at http://localhost:4000");
})