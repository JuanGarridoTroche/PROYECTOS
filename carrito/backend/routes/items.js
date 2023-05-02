const express = require('express');
const router = express.Router();

// MOCK
const itemsMock = require('../mock/items.json');

// GET ITEMS
router.get('/', (req, res) => {
  res.send(itemsMock);
})

router.get('/pokemon-rojo', (req, res) => {
  res.send('POKEMON ROJO');
})

module.exports = router;