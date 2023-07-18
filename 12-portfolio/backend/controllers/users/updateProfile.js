const { handleError } = require('../../helpers');
const selectUserByEmailQuery = require('../../queries/users/selectUserByEmailQuery');
const Joi = require('joi');
const updateDataUserQuery = require('../../queries/users/updateDataUserQuery');

const updateProfile = async (req, res, next) => {
  let {
    firstName,
    lastName1,
    lastName2,
    address,
    postcode,
    locality,
    province,
    country,
  } = req.body;
  const { id, email } = req.user;
  try {
    // Seleccionamos los datos guardados del usuario
    const originalDataUser = await selectUserByEmailQuery(email);
    console.log(originalDataUser);

    if (!firstName) {
      firstName = originalDataUser.firstName;
    }

    if (!lastName1) {
      lastName1 = originalDataUser.lastName1;
    }

    if (!lastName2) {
      lastName2 = originalDataUser.lastName2;
    }

    if (!address) {
      address = originalDataUser.address;
    }

    if (!postcode) {
      postcode = originalDataUser.postcode;
    }

    if (postcode.length !== 5) {
      throw handleError('El código postal tiene que tener 5 dígitos', 403);
    }

    if (!locality) {
      locality = originalDataUser.locality;
    }

    if (!province) {
      province = originalDataUser.province;
    }

    if (!country) {
      country = originalDataUser.country;
    }

    // Datos que vamos a guardar
    const dataUserUpdated = {
      firstName,
      lastName1,
      lastName2,
      address,
      postcode,
      locality,
      province,
      country,
    };

    // Validamos los datos que vamos a guardar
    const schema = Joi.object().keys({
      firstName: Joi.string().max(99),
      lastName1: Joi.string().max(99),
      lastName2: Joi.string().max(99),
      address: Joi.string().max(199),
      postcode: Joi.number().integer().positive().min(1001).max(52999),
      locality: Joi.string().max(99),
      province: Joi.string().max(50),
      country: Joi.string().max(50),
    });

    const validation = schema.validate(dataUserUpdated);
    if (validation.error || validation === null) {
      // console.log(validation.error);
      throw handleError('Error al validar los datos', 403);
    }

    // Actualizamos los datos del usuario en la BBDD
    await updateDataUserQuery(dataUserUpdated, id);

    res.send({
      status: 'Ok',
      message: 'Usuario actualizado',
      body: dataUserUpdated,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateProfile;
