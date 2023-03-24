const getConnection = require('../../getConnection');

const bcrypt = require('bcrypt');

const { generateError } = require('../../../helpers');

const updateUserRecPassQuery = async (recoverPassCode, password) => {
    let connection;

    try {
        connection = await getConnection();

        const [users] = await connection.query(
            `SELECT id FROM users WHERE recoverPassCode = ?`,
            [recoverPassCode]
        );

        // Si no existe ningún usuario con ese código de recuperación lanzamos un error.
        if (users.length < 1) {
            throw generateError(
                'Código de recuperación de contraseña incorrecto',
                404
            );
        }

        // Encriptamos la contraseña.
        const hashedPass = await bcrypt.hash(password, 10);

        // Actualizamos al usuario.
        await connection.query(
            `UPDATE users SET password = ?, recoverPassCode = null, modifiedAt = ? WHERE recoverPassCode = ?`,
            [hashedPass, new Date(), recoverPassCode]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateUserRecPassQuery;
