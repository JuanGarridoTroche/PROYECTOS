const selectEntryByIdQuery = require("../../bbdd/queries/entries/selectEntryByIdQuery");
const jwt = require("jsonwebtoken");

const getEntry = async (req, res, next) => {
  try {
    const { idEntry } = req.params;

    const { authorization } = req.headers;

    let tokenInfo;

    if (authorization) {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    }

    const entry = await selectEntryByIdQuery(idEntry, tokenInfo?.id);

    res.send({
      status: "ok",
      data: {
        entry,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getEntry;
