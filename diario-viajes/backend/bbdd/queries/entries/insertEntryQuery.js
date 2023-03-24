const getConnection = require('../../getConnection');

const insertEntryQuery = async (title, place, description, idUser) => {
    let connection;

    try {
        connection = await getConnection();

        // Insertamos la entrada y obtenemos los datos de la misma.
        const [newEntry] = await connection.query(
            `
                INSERT INTO entries (title, place, description, idUser, createdAt)
                VALUES (?, ?, ?, ?, ?)
            `,
            [title, place, description, idUser, new Date()]
        );

        // console.log(newEntry);

        // Retornamos el id que le ha asignado la base de datos a esta nueva entrada.
        return newEntry.insertId;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertEntryQuery;
