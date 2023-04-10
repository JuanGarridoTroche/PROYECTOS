require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const isAuth = require("./middlewares/isAuth");

const { PORT } = process.env;
const app = express();
//Monitorizamos en tiempo real cualquier petición que hacemos al servidor a través de nuestro terminal
app.use(morgan("dev"));

// Deserializa el body con formato JSON
app.use(express.json());

// Cross-Origin of Resource Sharing: Dependencia que facilita que un user-agent obtenga permiso para acceder a recursos seleccionados desde este servidor
// Middleware que permite conectar el backend (éste) con el frontend (React)
app.use(cors());

/*
 * ###########################
 * ## Middleware de /users  ##
 * ###########################
 */

const {
  loginUser,
  registerUser,
  validateUser,
  readLoggedProfile,
  getUserAccounts,
  updateUserProfile,
} = require("./controllers/users");

//Login de usuario
app.post("/user/login", loginUser);

// Registro de usuario
app.post("/user/register", registerUser);

// Validar un usuario.
app.put("/user/register/validate/:registrationCode", validateUser);

// Consultar los datos del perfil del usuario logged
app.get("/user/loggedProfile", isAuth, readLoggedProfile);

// Editar el perfil de usuario
app.put("/user/updateProfile", isAuth, updateUserProfile);

// Consultar las cuentas pertenecientes a un usuario
app.get("/user/accounts", isAuth, getUserAccounts);

/*
 * ###############################
 * ##  Middleware de /accounts  ##
 * ###############################
 */

const {
  createAccount,
  updateAccount,
  deleteAccount,
  readAccount,
} = require("./controllers/accounts");
// Crear una cuenta nueva
app.post("/account", isAuth, createAccount);

// Editar alias o nombre del banco
app.put("/account/:idAccount", isAuth, updateAccount);

// Eliminar una cuenta
app.delete("/account/:idAccount", isAuth, deleteAccount);

// Leer los datos de una cuenta
app.get("/account/:idAccount", isAuth, readAccount);

/*
 * #################################
 * ##  Middleware de /categories  ##
 * #################################
 */

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryData,
} = require("./controllers/categories");

// Leer las categorías de una cuenta
app.get("/account/:idAccount/categories", isAuth, getCategories);

// Obtener los datos de una categoría
app.get("/account/:idAccount/category/:idCategory", isAuth, getCategoryData);

// Crear una categoría de asiento bancario
app.post("/account/:idAccount/category", isAuth, createCategory);

// Actualizar una categoría de asiento bancario
app.put("/account/:idAccount/category/:idCategory", isAuth, updateCategory);

// Eliminar un tipo de asiento
app.delete("/account/:idAccount/category/:idCategory", isAuth, deleteCategory);

/*
 * ###################################
 * ##  Middleware de subcategories  ##
 * ###################################
 */

const {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getSubcategories,
} = require("./controllers/subcategories");

// Conseguir todas las subcategorías de una categoría
app.get("/category/:idCategory/subs", isAuth, getSubcategories);

// Crear una subcategoría
app.post("/category/:idCategory/sub", isAuth, createSubcategory);

// Actualizar una subcategoría
app.put("/category/:idCategory/sub/:idSub", isAuth, updateSubcategory);

// Eliminar una subcategoría
app.delete("/category/:idCategory/sub/:idSub", isAuth, deleteSubcategory);

/*
 * ##############################
 * ##  Middleware de /entries  ##
 * ##############################
 */
const {
  createEntry,
  updateEntry,
  deleteEntry,
  readAccountEntries,
} = require("./controllers/entries");

// Leer todos los asientos bancarios de una cuenta
app.get("/account/:idAccount/entries", isAuth, readAccountEntries);

// Crear un asiento nuevo
app.post("/account/:idAccount/entry", isAuth, createEntry);

// Actualizar un asiento
app.put("/account/:idAccount/entry/:idEntry", isAuth, updateEntry);

// Eliminar un asiento
app.delete("/account/:idAccount/entry/:idEntry", isAuth, deleteEntry);


/*
* #####################################
* ##  Middleware upload excel files  ##
* #####################################
*/

const uploadEntriesExcelToJson = require("./controllers/entries/uploadEntriesExcelToJson");

// Subir, leer y pasar un excel a JSON
app.get("/account/:idAccount/upload", isAuth, uploadEntriesExcelToJson);



/*
 * ##########################################
 * ## Middleware de Error y 404 NOT FOUND  ##
 * ##########################################
 */

// Middleware de Error:
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).send({
    status: "error",
    message: err.message,
  });
});

// Middleware 404 NOT FOUND
app.use((req, res) => {
  res.status(404).send({
    status: "Error",
    message: "Ruta no encontrada 😿",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
