const getConnection = require('../../getConnection');

const { generateError } = require('../../../helpers');

const updateUserRegCodeQuery = async (registrationCode) => {
    let connection;

    try {
        connection = await getConnection();

        const [users] = await connection.query(
            `SELECT id FROM users WHERE registrationCode = ?`,
            [registrationCode]
        );

        // Si no existe ningún usuario con ese código de registro lanzamos un error.
        if (users.length < 1) {
            throw generateError('Código de registro incorrecto', 404);
        }

        // Actualizamos al usuario.
        await connection.query(
            `UPDATE users SET active = true, registrationCode = null, modifiedAt = ? WHERE registrationCode = ?`,
            [new Date(), registrationCode]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateUserRegCodeQuery;
