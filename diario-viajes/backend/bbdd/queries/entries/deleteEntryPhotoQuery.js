const getConnection = require('../../getConnection');

const { generateError, deletePhoto } = require('../../../helpers');

const deleteEntryPhotoQuery = async (idPhoto) => {
    let connection;

    try {
        connection = await getConnection();

        // Comprobamos que la foto exista.
        const [photos] = await connection.query(
            `SELECT name FROM entryPhotos WHERE id = ?`,
            [idPhoto]
        );

        if (photos.length < 1) {
            throw generateError('Foto no encontrada', 404);
        }

        // Eliminamos la foto del disco.
        await deletePhoto(photos[0].name);

        // Eliminamos la foto.
        await connection.query(`DELETE FROM entryPhotos WHERE id = ?`, [
            idPhoto,
        ]);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteEntryPhotoQuery;
