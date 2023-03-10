const jwt = require('jsonwebtoken');
const selectUserByIdQuery = require('../bbdd/queries/users/selectUserByIdQuery');

const { generateError } = require('../helpers');

const isAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            throw generateError('Falta la cabecera de autenticación', 400);
        }

        // Variable donde almacenaremos la información del token una vez desencriptado.
        let tokenInfo;

        try {
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch {
            throw generateError('Token incorrecto', 401);
        }

        // Podría ser buena idea llegado este punto comprobar si el usuario está activo.        
        const activeUser = await selectUserByIdQuery(tokenInfo.id);
        if(activeUser.length < 1) {
            throw generateError("El usuario no existe", 404)
        }
        if(!activeUser.active) {
            throw generateError("El usuario no está activo. Actívalo para poder acceder a la gestión de cuentas", 404)
        }
        
        // Creamos la propiedad "user" con los datos del token (es un objeto) dentro del objeto "req".
        req.user = tokenInfo;        

        // Pasamos el control a la siguiente función.
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = isAuth;