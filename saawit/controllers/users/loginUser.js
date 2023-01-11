const { generateError } = require("../../helpers");
const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Comprobar que han introducido email y contraseña
    if (!email || !password) {
      throw generateError("Faltan campos", 400);
    }

    //Vamos a comprobar que existe el email en nuestra base de datos
    const user = await selectUserByEmailQuery(email);

    //Comprobamos que la contraseña es válida
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError("Contraseña incorrecta", 401);
    }

    //Comprobamos que el usuario está activo
    if (!user.active) {
      throw generateError("El usuario no está activo", 401);
    }

    // Creamos el objeto con los datos que queremos guardar dentro del token
    const tokenIfo = {
      id: user.id,
      role: user.role,
    };

    // Creamos el token
    const token = jwt.sign(tokenIfo, process.env.SECRET);

    res.send({
      status: "ok",
      message: "Login realizado con éxito",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = loginUser;
