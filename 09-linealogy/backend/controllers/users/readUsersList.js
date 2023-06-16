const selectUsersQuery = require('../../queries/users/selectUsersQuery');

const readUsersList = async (req, res, next) => {
  try {
    // Accedo a los datos del usuario:
    const users = await selectUsersQuery();

    res.send({
      status: 'ok',
      message: 'Listado de usuarios:',
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = readUsersList;
