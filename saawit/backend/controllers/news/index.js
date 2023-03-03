const createNews = require("./createNews");
const editNews = require("./editNews");
const deleteNews = require("./deleteNews");
const voteNews = require("./voteNews");
const NewsOrderedByFeedback = require('./newsOrderedByFeedback')
const newsByCategory = require('./newsByCategory')
const readNews = require('./readNews');
const listNews = require ('./listNews')
const newsShowImages = require('./newsShowImages')
const searchingNews = require('./searchingNews')
const checkVotedNews = require('./checkVotedNews')

module.exports = {
  createNews,
  editNews,
  deleteNews,
  voteNews,
  newsByCategory,
  readNews,
  listNews,
  NewsOrderedByFeedback,
  newsShowImages,
  searchingNews,
  checkVotedNews,
};
