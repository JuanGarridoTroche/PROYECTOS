const { handleError } = require('../helpers');
const jwt = require('jsonwebtoken');


const isAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Comprobamos que nos ha enviado autorización
    if (!authorization) {
      throw handleError('Autorización no válida', 403);
    }

    // Almacenamos la info del token
    let tokenInfo;
    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
      
    } catch {
      throw handleError('Token incorrecto', 401);
    }
   
    // Creamos el atributo user
    req.user = tokenInfo;
    
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isAuth;
