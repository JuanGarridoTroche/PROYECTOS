const updateUserRecPassQuery = require('../../bbdd/queries/users/updateUserRecPassQuery');

const { generateError } = require('../../helpers');

const editPassword = async (req, res, next) => {
    try {
        const { recoverPassCode, password, repeatedPassword } = req.body;

        if (!recoverPassCode || !password || !repeatedPassword) {
            throw generateError('Faltan campos', 400);
        }

        if (password !== repeatedPassword) {
            throw generateError('Las contraseñas no coinciden', 400);
        }

        // Actualizamos la contraseña del usuario.
        await updateUserRecPassQuery(recoverPassCode, password);

        res.send({
            status: 'ok',
            message: 'Usuario actualizado',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = editPassword;
