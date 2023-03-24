const selectUserByIdQuery = require('../../bbdd/queries/users/selectUserByIdQuery');
const updateUserAvatarQuery = require('../../bbdd/queries/users/updateUserAvatarQuery');

const { generateError, savePhoto, deletePhoto } = require('../../helpers');

const editAvatar = async (req, res, next) => {
    try {
        // Si no hay imágen lanzamos un error.
        if (!req.files?.avatar) {
            throw generateError('Faltan campos', 400);
        }

        // Obtenemos los datos del usuario que queremos editar para comprobar
        // si ya tiene un avatar previo.
        const user = await selectUserByIdQuery(req.user.id);

        // Si el usuario ya tiene un avatar previo lo eliminamos de la carpeta
        // uploads.
        if (user.avatar) {
            await deletePhoto(user.avatar);
        }

        // Guardamos el avatar en la carpeta uploads y obtenemos el nombre con el
        // cuál lo hemos guardado.
        const avatar = await savePhoto(req.files.avatar);

        // Actualizamos el avatar del usuario en la base de datos.
        await updateUserAvatarQuery(avatar, req.user.id);

        res.send({
            status: 'ok',
            message: 'Usuario actualizado',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = editAvatar;
