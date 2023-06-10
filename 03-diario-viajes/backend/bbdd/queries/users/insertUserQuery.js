const getConnection = require('../../getConnection');

const bcrypt = require('bcrypt');

const { generateError } = require('../../../helpers');

const insertUserQuery = async (username, email, password, registrationCode) => {
    let connection;

    try {
        connection = await getConnection();

        // Tratamos de obtener a un usuario con ese nombre de usuario o ese email.
        const [users] = await connection.query(
            `SELECT id FROM users WHERE username = ? OR email = ?`,
            [username, email]
        );

        if (users.length > 0) {
            throw generateError('Email o nombre de usuario existente', 403);
        }

        // Encriptamos la contraseña.
        const hashPass = await bcrypt.hash(password, 10);

        // Insertamos al usuario.
        await connection.query(
            `INSERT INTO users (username, email, password, registrationCode, createdAt)
            VALUES (?, ?, ?, ?, ?)`,
            [username, email, hashPass, registrationCode, new Date()]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertUserQuery;
