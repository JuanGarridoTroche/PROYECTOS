const login = require('./login');
const updateProfile = require('./updateProfile');
const readProfile = require('./readProfile');
const updatePassword = require('./updatePassword')
const sendRecoverPasswordEmail = require("./sendRecoverPasswordEmail")

module.exports = { login, updateProfile, readProfile, updatePassword,sendRecoverPasswordEmail };
