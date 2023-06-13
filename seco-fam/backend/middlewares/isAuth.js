const jwt = require("jsonwebtoken");
const { generateError } = require("../helpers");

const  isAuth = async(req, res, next) => {
  try {
    const {authorization} = req.headers;

    if(!authorization) {
      throw generateError("Falta la cabecera de autenticación", 400);
    }

    // Almacenamos la info del token
    let tokenInfo;
    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
      
      if(!tokenInfo.active) {
        throw generateError("Usuario deshabilitado. Hable con el admnistrador para más información")
      }
    } catch {
      throw generateError("Token incorrecto", 401);
    }

    // Creamos la propiedad "user" con los datos del token
    req.user = tokenInfo;
    next();
    
  } catch (err) {
    next(err);
  }
}

module.exports = isAuth;