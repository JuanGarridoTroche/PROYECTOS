const selectEntryByIdQuery = require("../../bbdd/queries/entries/selectEntryByIdQuery");
const insertVoteQuery = require("../../bbdd/queries/entries/insertVoteQuery");

const { generateError } = require("../../helpers");

const voteEntry = async (req, res, next) => {
  try {
    const { idEntry } = req.params;

    const { value } = req.body;

    // Obtenemos la entrada.
    const entry = await selectEntryByIdQuery(idEntry);

    // Si somos los dueños de la entrada restringimos el voto.
    if (entry.idUser === req.user.id) {
      throw generateError("No puedes votar tu propia entrada", 403);
    }

    // Array con votos válidos.
    const validVotes = [1, 2, 3, 4, 5];

    // Si el voto no es un valor válido lanzamos un error.
    if (!validVotes.includes(value)) {
      throw generateError("Voto no válido", 400);
    }

    // Votamos la entrada.
    const newVotesAvg = await insertVoteQuery(value, req.user.id, idEntry);

    res.send({
      status: "ok",
      message: "Voto enviado",
      data: {
        votes: newVotesAvg,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = voteEntry;
