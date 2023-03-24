const insertEntryQuery = require('../../bbdd/queries/entries/insertEntryQuery');
const insertPhotoQuery = require('../../bbdd/queries/entries/insertPhotoQuery');

const { generateError, savePhoto } = require('../../helpers');

const newEntry = async (req, res, next) => {
    try {
        const { title, place, description } = req.body;

        if (!title || !place || !description) {
            throw generateError('Faltan campos', 400);
        }

        // Insertamos la entrada y obtenemos el id que se le ha asignado
        // en la base de datos.
        const idEntry = await insertEntryQuery(
            title,
            place,
            description,
            req.user.id
        );

        // Array donde pushearemos el nombre de las fotos (si hay).
        const photos = [];

        // Si "req.files" tiene fotos las guardamos.
        if (req.files) {
            // Recorremos las fotos y por si las moscas nos quedamos únicamente
            // con las tres fotos.
            for (const photo of Object.values(req.files).slice(0, 3)) {
                // Guardamos la foto en el disco.
                const photoName = await savePhoto(photo, 1);

                // Pusheamos el nombre de la foto al array de fotos.
                photos.push(photoName);

                // Guardamos la foto en la base de datos.
                await insertPhotoQuery(photoName, idEntry);
            }
        }

        res.send({
            status: 'ok',
            data: {
                entry: {
                    id: idEntry,
                    title,
                    place,
                    description,
                    photos,
                    idUser: req.user.id,
                    createdAt: new Date(),
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = newEntry;
