const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, (req, res, next) => {
  Product.findById(req.body.productId)
    .then()
    .catch((err) => {
      res.status(500).json({ message: "Product not found", error: err });
    });
  Order.find()
    .select("product quantity _id")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/", checkAuth, (req, res, next) => {
  const order = new Order({
    quantity: req.body.quantity,
    product: req.body.productId,
  });
  order
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
