const loginUser = require('./loginUser');
const registerUser = require('./registerUser');
const validateUser = require('./validateUser');
const updateActivationSolicitude = require('./updateActivationSolicitude');
const updateUserProfile = require('./updateUserProfile');
const editPassword = require('./editPassword')
const checkPassword = require('./checkPassword')
const sendRecoverPassword = require("./sendRecoverPassword")
const recoverPassword = require('./recoverPassword')

module.exports = {
  loginUser,
  registerUser,
  validateUser,
  updateActivationSolicitude,
  updateUserProfile,
  editPassword,
  checkPassword,
  sendRecoverPassword,
  recoverPassword,
};
