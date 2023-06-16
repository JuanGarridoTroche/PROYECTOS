const createEntry = require("./createEntry");
const updateEntry = require("./updateEntry");
const deleteEntry = require("./deleteEntry");
const uploadEntries = require("./uploadEntries")
const readAccountEntries = require("../entries/readAccountEntries");

module.exports = {
  createEntry,
  updateEntry,
  deleteEntry,
  uploadEntries,
  readAccountEntries,
}