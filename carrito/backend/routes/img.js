const express = require('express');
const router = express.Router();

const path = require('path');

// IMAGE PATH
const imgFolderPath = path.join(__dirname, '../img/');

// MOCK
const itemsMock = require('../mock/items.json');

// GET IMAGES
router.get('/:imgName', (req, res) => {
  const image = req.params.imgName;
  // console.log('imageName: ', image);
  res.sendFile(`${imgFolderPath}${image}`)
})

router.get('/pokemon-rojo', (req, res) => {
  res.send('POKEMON ROJO');
})


module.exports = router;