"use strict";
const { generateError } = require("../../helpers");

const uploadPDF = async (req, res, next) => {

  try {
    

    res.send({
      status: "Ok",
      message: "pdf subido correctamente"
    })
  } catch (err) {
    next(err);
  }

}

module.exports = uploadPDF;