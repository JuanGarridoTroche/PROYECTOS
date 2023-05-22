const { generateError } = require("../helpers");
const jwt = require("jsonwebtoken");
const selectUserByIdQuery = require("../queries/users/selectUserByIdQuery");

const isAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Comprobamos que nos ha enviado una autorización
    if (!authorization) {
      throw generateError("Autorización no válida", 403);
    }    
    
    // Almacenamos la info del token
    let tokenInfo;
    
    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    } catch {
      throw generateError("Token incorrecto", 401);
    }
    // Comprobamos que el usuario esté activo
    const checkUserIsActive = await selectUserByIdQuery(tokenInfo.id);
    if(checkUserIsActive.length < 1) {
      throw generateError("El usuario no existe", 404)
    }
    if(!checkUserIsActive.active) {
      throw generateError("El usuario no está activo. Actívalo primero para poder realizar alguna accción", 403)
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
