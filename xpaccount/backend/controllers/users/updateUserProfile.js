const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");
const updateUserProfileQuery = require("../../bbdd/queries/users/updateUserProfileQuery");
const { generateError } = require("../../helpers");
const joi = require('@hapi/joi');

const updateUserProfile = async (req, res, next) => {
  try {
    const idUser = req.user.id;
    const {username, email} = req.body;
    let {birthday, firstName, lastName, dni} =req.body;

    // Obtenemos los datos originales de la BBDD
    const originalData = await selectUserByIdQuery(idUser);
    console.log(originalData);

    if(!originalData) {
      throw generateError("El usuario no existe", 404);
    }


    //Comprobar los datos que quiere actualizar el usuario
    if (username !== originalData.username || email !==originalData.email) {
      throw generateError("El nombre de usuario y el email no se pueden mmodificar", 403);
    }

    //Validamos el dni de usuario
    if(dni) {
      const schemaDni = joi
        .string()
        .length(9)
        .uppercase()
        .error(new Error("Introduzca un DNI válido", 400));
      const validationDni = schemaDni.validate(dni);
  
      if (validationDni.error || validationDni === null) {
        throw generateError(validationDni.error.message);
      }
  
      const validateDni = () => {
        const validLetters = [
          "T",
          "R",
          "W",
          "A",
          "G",
          "M",
          "Y",
          "F",
          "P",
          "D",
          "X",
          "B",
          "N",
          "J",
          "Z",
          "S",
          "Q",
          "V",
          "H",
          "L",
          "C",
          "K",
          "E",
        ];
        const checkNumbers = dni.slice(0, -1);
        const checkLetter = dni.toUpperCase().slice(8, 9);
  
        // Comprobamos que los 8 primeros caracteres son números y que el éultimo es una letra del array validLetters
        if (isNaN(checkNumbers) || !validLetters.find((e) => e === checkLetter)) {
          throw generateError("Introduzca un DNI válido", 400);
        }
        const validDni = [checkNumbers, checkLetter];
  
        //Calcular la letra del DNI y validarlo:
        validDni.push(validDni[0] % 23);
        if (validDni[1] !== validLetters[validDni[2]]) {
          throw generateError("Introduzca un DNI válido", 400);
        }
      };
      
      dni ? validateDni() : dni = null;
  
    }
    let birth = new Date();

    if(!birthday){
      birth = originalData.birthday
    } else {
      birth = new Date(birthday.split("/",3).reverse().join("/"));      
    }   
    if(!firstName){firstName=originalData.firstName}
    if(!lastName){lastName=originalData.lastName}
    if(!dni){dni=originalData.dni}

    // Actualizamos los datos
    await updateUserProfileQuery({idUser, birth, firstName, lastName, dni});

    
    res.send({
      status: "ok",
      message: "Usuario actualizado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateUserProfile;
