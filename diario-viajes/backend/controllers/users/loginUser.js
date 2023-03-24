const selectUserByEmailQuery = require('../../bbdd/queries/users/selectUserByEmailQuery');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { generateError } = require('../../helpers');

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw generateError('Faltan campos', 400);
        }

        // Obtenemos al usuario con el email del body.
        const user = await selectUserByEmailQuery(email);

        // Comprobamos si la contraseña es válida.
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw generateError('Constraseña incorrecta', 401);
        }

        // Si el usuario no está activado lanzamos un error.
        if (!user.active) {
            throw generateError('Usuario pendiente de verificar', 401);
        }

        // Objeto con los datos que queremos guardar en el token.
        const tokenInfo = {
            id: user.id,
            role: user.role,
        };

        // Creamos el token.
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '7d',
        });

        res.send({
            status: 'ok',
            data: {
                token,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = loginUser;
