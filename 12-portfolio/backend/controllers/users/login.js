const { handleError } = require('../../helpers');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const selectUserByEmailQuery = require('../../queries/users/selectUserByEmailQuery');
const selectPasswordByEmailQuery = require('../../queries/users/selectPasswordByEmailQuery');
const { SECRET } = process.env;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);

    // Comprobar que existen los 2 datos
    if (!email || !password) {
      // console.log("falta usuario o contraseña");
      throw handleError(
        'Debe tener todos los campos para acceder a la web',
        404
      );
    }

    // Validamos el email
    const emailSchema = Joi.string().email().required();
    const emailValidation = emailSchema.validate(email);

    if (emailValidation === null || emailValidation.error) {
      // console.log("email no válido");
      throw handleError('Credenciales incorrectas', 403);
    }

    // Comprobar que existe el email en la BBDD
    const user = await selectUserByEmailQuery(email);

    if (!user) {
      // console.log("No existe el usuario en la BBDD");
      throw handleError('credenciales inválidas', 403);
    }

    // Comprobamos que la contraseña es correcta

    const pwd = await selectPasswordByEmailQuery(email);
    
    const validPassword = await bcrypt.compare(password, pwd);
    if (!validPassword) {
      // console.log("Contraseña incorrecta");
      throw handleError('credenciales incorrectas', 403);
    }

    // Creamos el objeto con los datos que queremos guardar dentro del token
    const tokenInfo = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
    
    // Creamos el token
    const token = jwt.sign(tokenInfo, SECRET, {
      algorithm: 'HS512',
      expiresIn: '3d'
    });

    res.send({
      status: 'Ok',
      message: 'Usuario logueado',
      data: token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = login;
