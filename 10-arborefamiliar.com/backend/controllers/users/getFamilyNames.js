const getAllFamilies = require('../../assets/queries/getAllFamilies');
const { generateError } = require('../../helpers');

const getFamilyNames = async (req, res, next) => {
  const { id } = req.user;
  try {
    if (id !== 'fs-VvW-X6l-hI') {
      throw generateError('No tienes permiso para ver esta información', 403);
    }

    // Conseguimos todos los nombres de las familias.
    const families = await getAllFamilies();

    res.send({
      status: 'Ok',
      message: 'Familias de la web',
      data: families,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getFamilyNames;
