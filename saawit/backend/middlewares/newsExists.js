const getConnection = require('../bbdd/getConnection');

const { generateError } = require('../helpers');

const newsExists = async (req, res, next) => {
    let connection;

    try {
        connection = await getConnection();

        const { idNews } = req.params;

        // Comprobamos que la noticia exista.
        const [news] = await connection.query(
            `SELECT * FROM news WHERE id = ?`,
            [idNews]
        );

        if (news.length < 1) {
            throw generateError('Noticia no encontrada', 404);
        }

        // Pasamos el control a la siguiente función controladora.
        next();
    } catch (err) {
        next(err);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newsExists;