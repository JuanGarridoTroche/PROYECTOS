'use strict'

const {generateError} = require("../../helpers");
const insertUserQuery = require('../../bbdd/queries/users/insertUserQuery');

const newUser = async (req, res, next) => {

  try {
    const {username, email, password, bio} =req.body;

    //Comprobar que el usuario nos da un nombre de usuario, una cuenta de correo válidos y una contraseña
    if(!username || !email || !password) {
      throw generateError('Faltan campos por cumplimentar', 400);
    }

    // Comprobar que el nombre de usuario y la cuenta de correo no estén registrados ya en nuestra BBDD. Si no existe insertamos el usuario.
    await insertUserQuery(username, email, password, bio);

    

    res.send({
      status: 'ok',
      message:
          'Usuario creado',
  });
    
  } catch (err) {
    next(err);
  }

}

module.exports = newUser;