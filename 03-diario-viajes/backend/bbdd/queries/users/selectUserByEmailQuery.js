const getConnection = require('../../getConnection');

const { generateError } = require('../../../helpers');

const selectUserByEmailQuery = async (email) => {
    let connection;

    try {
        connection = await getConnection();

        const [users] = await connection.query(
            `SELECT id, password, role, active FROM users WHERE email = ?`,
            [email]
        );

        if (users.length < 1) {
            throw generateError('Email incorrecto', 404);
        }

        return users[0];
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectUserByEmailQuery;
