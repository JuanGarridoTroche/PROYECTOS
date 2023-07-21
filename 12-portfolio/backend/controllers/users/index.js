const login = require('./login');
const updateProfile = require('./updateProfile');
const readProfile = require('./readProfile');
const updatePassword = require('./updatePassword');
const sendPassCodeEmail = require('./sendPassCodeEmail');
const updatePasswordWithPassCode = require('./updatePasswordWithPassCode');

module.exports = {
  login,
  updateProfile,
  readProfile,
  updatePassword,
  sendPassCodeEmail,
  updatePasswordWithPassCode,
};
