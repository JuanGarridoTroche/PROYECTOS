const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res, next) => {
  try {
    const { password } = req.body;

    //Comprobamos que el usuario está activo
    if (!user.active) {
      throw generateError("El usuario no está activo", 401);
    }

    //Comprobar que han introducido email y contraseña
    if (!password) {
      throw generateError("Introduce una contraseña", 400);
    }

    // Encriptamos la contraseña
    const hashPass = await bcrypt.hash(password, 10);
    console.log(hashPass);
  
    //Comprobamos que la contraseña es válida
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError("Contraseña incorrecta", 401);
    }

    // Creamos el objeto con los datos que queremos guardar dentro del token
    const tokenIfo = {
      id: user.id,
      role: user.role,
      email:user.email,
      username:user.username,
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
