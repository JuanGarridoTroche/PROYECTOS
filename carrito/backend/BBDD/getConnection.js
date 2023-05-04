const mongoose = require("mongoose");



// Obtenemos las variables de entorno necesarias.
const { MONGODB_USER, MONGODB_PASS, MONGODB_NAME } = process.env;




// Función que retorna una conexión libre con la base de datos.
const getConnection = () => {    
    try {
        // Si no hay un grupo de conexiones lo creamos.       
        mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@carrito.zqlc28l.mongodb.net/${MONGODB_NAME}?retryWrites=true&w=majority`);
        
        const db = mongoose.connection;
        return db.once('MongoDB open', () => console.log('conectado a una base de datos MongoDB'))

        
        
    } catch (err) {
        console.error(err);
        db.on('Error al conectar con MONGODB', (err) => console.error(err));
    }
};

// Expotamos la función anterior.
module.exports = getConnection;
