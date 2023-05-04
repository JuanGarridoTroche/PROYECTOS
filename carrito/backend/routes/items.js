const express = require("express");
const router = express.Router();

// MODELS
const Item = require("../models/Item");

// MOCK
const itemsMock = require("../mock/items.json");

// GET ITEMS
router.get("/", async (req, res) => {
  res.send(itemsMock);
  // try {
  //   const itemsFromDB = await Item.find();
  //   console.log("🔥 itemsFromDB: ", itemsFromDB);
  //   res.json(itemsFromDB);
  // } catch (err) {
  //   res.json({ message: err.message });
  // }
});


// router.get("/pokemon-rojo", async (req, res) => {
//   res.send("POKEMON ROJO");
// });

// CREATE ITEM
router.post("/", async (req, res) => {
  console.log('Datos del nuevo registro: ', req.body);
  const item = new Item({
    title: req.body.title,
    price: req.body.price,
    image: req.body.image,
  });
  console.log('item', item);
  try {
    const newItem = await item.save();
    res.json(newItem);
  } catch (err) {
    res.json({ message: err.message });
  }
});


module.exports = router;
