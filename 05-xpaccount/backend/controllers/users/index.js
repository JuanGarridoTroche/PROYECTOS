const loginUser = require("./loginUser");
const registerUser = require("./registerUser")
const validateUser = require("./validateUser")
const readLoggedProfile = require("./readLoggedProfile")
const getUserAccounts = require("./getUserAccounts")
const updateUserProfile = require("./updateUserProfile")

module.exports = {
  loginUser, 
  registerUser,
  validateUser,
  readLoggedProfile,
  getUserAccounts,
  updateUserProfile,
}