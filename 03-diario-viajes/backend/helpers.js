const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const nodemailer = require('nodemailer');
const { v4: uuid } = require('uuid');

// Obtenemos las variables de entorno necesarias.
const { SIB_SMTP_USER, SIB_SMTP_PASS, UPLOADS_DIR } = process.env;

const transport = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: SIB_SMTP_USER,
        pass: SIB_SMTP_PASS,
    },
});

/**
 * ####################
 * ## Generate Error ##
 * ####################
 */

const generateError = (msg, status) => {
    const err = new Error(msg);
    err.statusCode = status;
    return err;
};

/**
 * ###############
 * ## Send Mail ##
 * ###############
 */

const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: SIB_SMTP_USER,
        to,
        subject,
        text,
    };

    await transport.sendMail(mailOptions);
};

/**
 * ################
 * ## Save Photo ##
 * ################
 */

const savePhoto = async (img, imgType = 0) => {
    // Ruta absoluta al directorio de subida de archivos.
    const uploadsPath = path.join(__dirname, UPLOADS_DIR);

    try {
        // Intentamos acceder al directorio uploads.
        await fs.access(uploadsPath);
    } catch {
        // Si no es posible acceder al directorio "access" lanzará un error.
        // Por tanto, si entramos en el catch creamos el directorio.
        await fs.mkdir(uploadsPath);
    }

    // Para poder redimensionar la imagen necesitamos crear un objeto Sharp a
    // partir de la imagen dada.
    const sharpImg = sharp(img.data);

    // Si se trata de un avatar lo redimensionaremos a 150px, de lo contrario,
    // redimensionaremos a 500px.
    if (!imgType) {
        // Redimensionamos a 150px.
        sharpImg.resize(150);
    } else {
        // Redimensionamos a 500px.
        sharpImg.resize(500);
    }

    // Generamos un nombre aleatorio para la imagen.
    const imgName = `${uuid()}.jpg`;

    // Ruta absoluta a la imagen.
    const imgPath = path.join(uploadsPath, imgName);

    // Guardamos la imagen en la carpeta uploads.
    await sharpImg.toFile(imgPath);

    // Retornamos el nombre de la imagen.
    return imgName;
};

/**
 * ##################
 * ## Delete Photo ##
 * ##################
 */

const deletePhoto = async (imgName) => {
    try {
        // Creamos la ruta absoluta a la imagen.
        const photoPath = path.join(__dirname, UPLOADS_DIR, imgName);

        try {
            // Intentamos acceder a la imagen a través del método "access".
            await fs.access(photoPath);
        } catch {
            // Si no es posible acceder a la imagen el método access lanza un error.
            // En ese caso finalizamos la función.
            return;
        }

        // Si llegamos hasta aquí quiere decir que la imagen existe. La eliminamos.
        await fs.unlink(photoPath);
    } catch {
        throw generateError('Error al eliminar la imagen del servidor');
    }
};

module.exports = {
    generateError,
    sendMail,
    savePhoto,
    deletePhoto,
};
