const express = require("express");
const router = express.Router();

// MODELS
const Item = require("../models/Item");

// MOCK
const itemsMock = require("../mock/items.json");

// GET ITEMS
router.get("/", (req, res) => {
  res.send(itemsMock);
});

router.get("/pokemon-rojo", async (req, res) => {
  res.send("POKEMON ROJO");
});

// CREATE ITEM
router.post("/", async (req, res) => {
  console.log(req.body);
  const item = new Item({
    title: req.body.title,
    price: req.body.price,
    image: req.body.image,
  });

  try {
    const newItem = await item.save();
    res.json(newItem);
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
