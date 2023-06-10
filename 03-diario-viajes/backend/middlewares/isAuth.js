const jwt = require('jsonwebtoken');

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

        // Creamos la propiedad "user" en el objeto "req".
        req.user = tokenInfo;

        // Pasamos el control a la siguiente función.
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = isAuth;
