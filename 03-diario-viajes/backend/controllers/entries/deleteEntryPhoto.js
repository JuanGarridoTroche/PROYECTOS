const selectEntryByIdQuery = require('../../bbdd/queries/entries/selectEntryByIdQuery');
const deleteEntryPhotoQuery = require('../../bbdd/queries/entries/deleteEntryPhotoQuery');

const { generateError } = require('../../helpers');

const deleteEntryPhoto = async (req, res, next) => {
    try {
        const { idEntry, idPhoto } = req.params;

        // Obtenemos la entrada.
        const entry = await selectEntryByIdQuery(idEntry);

        // Si no somos los dueños lanzamos un error.
        if (entry.idUser !== req.user.id) {
            throw generateError('No tienes suficientes permisos', 401);
        }

        // Borramos la foto.
        await deleteEntryPhotoQuery(idPhoto);

        res.send({
            status: 'ok',
            message: 'Foto eliminada',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = deleteEntryPhoto;
