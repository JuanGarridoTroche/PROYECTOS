/*
 * #################################
 * ## MANEJAR ERROR EN EL BACKEND ##
 * #################################
 */
const handleError = (msg, status) => {
  const err = new Error(msg);
  err.statusCode = status;
  return err;
};

module.exports = { handleError };
