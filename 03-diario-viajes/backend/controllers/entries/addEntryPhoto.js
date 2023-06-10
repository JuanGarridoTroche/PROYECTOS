const selectEntryByIdQuery = require('../../bbdd/queries/entries/selectEntryByIdQuery');
const insertPhotoQuery = require('../../bbdd/queries/entries/insertPhotoQuery');

const { generateError, savePhoto } = require('../../helpers');

const addEntryPhoto = async (req, res, next) => {
    try {
        const { idEntry } = req.params;

        // Si no hay foto lanzamos un error.
        if (!req.files?.photo) {
            throw generateError('Faltan campos', 400);
        }

        // Obtenemos la entrada.
        const entry = await selectEntryByIdQuery(idEntry);

        // Si no somos los dueños lanzamos un error.
        if (entry.idUser !== req.user.id) {
            throw generateError('No tienes suficientes permisos', 401);
        }

        // Si a entrada tiene ya 3 fotos lanzamos un error.
        if (entry.photos.length > 2) {
            throw generateError(
                'La entrada ya tiene el máximo de fotos permitidas',
                403
            );
        }

        // Guardamos la foto en disco y obtenemos el nombre.
        const photoName = await savePhoto(req.files.photo);

        // Guardamos la foto en la base de datos.
        await insertPhotoQuery(photoName, idEntry);

        res.send({
            status: 'ok',
            message: 'Foto insertada',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = addEntryPhoto;
