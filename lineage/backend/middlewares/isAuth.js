const { generateError } = require("../helpers");
const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(authorization);

    // Comprobamos que nos ha enviado una autorización
    if (!authorization) {
      throw generateError("Autorización no válida.", 403);
    }

    // Almacenamos la info del token
    let tokenInfo;

    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
      // console.log(tokenInfo);
    } catch {
      throw generateError("Token incorrecto", 401);
    }

    // Creamos la propiedad user en el request
    req.user = tokenInfo;
    // console.log(req.user);

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isAuth;
