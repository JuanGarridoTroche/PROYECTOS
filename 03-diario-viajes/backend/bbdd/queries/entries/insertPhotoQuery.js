const getConnection = require('../../getConnection');

const insertPhotoQuery = async (photo, idEntry) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(
            `INSERT INTO entryPhotos (name, idEntry, createdAt) VALUES (?, ?, ?)`,
            [photo, idEntry, new Date()]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertPhotoQuery;
