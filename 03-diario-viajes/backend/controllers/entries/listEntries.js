const selectAllEntriesQuery = require("../../bbdd/queries/entries/selectAllEntriesQuery");
const jwt = require("jsonwebtoken");

const listEntries = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    let tokenInfo;

    if (authorization) {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    }

    const { search } = req.query;

    const entries = await selectAllEntriesQuery(tokenInfo?.id, search);

    res.send({
      status: "ok",
      data: {
        entries,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = listEntries;
