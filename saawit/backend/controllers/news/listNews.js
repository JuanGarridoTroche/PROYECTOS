const selectAllNewsQuery = require("../../bbdd/queries/news/selectAllNewsQuery");
// const selectAllVotesQuery = require("../../bbdd/queries/news/selectAllVotesQuery");

const listNews = async (req, res, next) => {
  try {         
    let {keyword, category, orderBy, direction} =req.query; 

    
    const validCategories = ['deportes', 'videojuegos', 'noticias', 'programación', 'viajes', 'tecnología', 'música', 'memes', 'general'];

    keyword = keyword || ''
    category = validCategories.includes(category) ? category : '';
    orderBy = orderBy === 'votes' ? 'votes' : 'createdAt';
    direction = direction === 'ASC' ? 'ASC' : 'DESC';

      const news = await selectAllNewsQuery({keyword, category, orderBy, direction});

      res.send({
      status: "Ok",
      message: `Listado de las noticias:`,
      data: {
        news,
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = listNews;