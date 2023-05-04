const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");

// Obtenemos las variables de entorno necesarias.
const { MONGODB_USER, MONGODB_PASS, MONGODB_NAME } = process.env;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@carrito.zqlc28l.mongodb.net/${MONGODB_NAME}?retryWrites=true&w=majority`;

// console.log(MONGODB_USER, MONGODB_PASS, MONGODB_NAME);

// Función que retorna una conexión libre con la base de datos.
const getConnection = async () => {
  try {
    // mongoose.set('strictQuery', false);
    // Si no hay un grupo de conexiones lo creamos.
    // mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@carrito.zqlc28l.mongodb.net/${MONGODB_NAME}?retryWrites=true&w=majority`,{useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useCreateIndex:true});
    await mongoose.connect(uri);
    console.log("Conectado a carritoShop");
    const db = mongoose.connection;
    return db.once("MongoDB open", () =>
      console.log("conectado mi base de datos MongoDB")
    );
  } catch (err) {
    console.error(err);
    db.on("Error al conectar con MONGODB", (err) => console.error(err));
  } finally {
    await mongoose.close();
  }
};

// Expotamos la función anterior.
module.exports = getConnection;
