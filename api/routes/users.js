const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", async (req, res, next) => {
  try {
    const userexists = await User.findOne({ email: req.body.email });
    if (userexists) {
      return res
        .status(409)
        .json({ message: "user with that email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      const user = await new User({
        email: req.body.email,
        password: hashedPassword,
      });
      await user.save();
      res.status(201).json({ message: "user successfully created", user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      if (token) {
        res
          .status(200)
          .json({ message: "successfully logged in", token: token });
      }
    }
  } catch (error) {
    res.status(401).json({ message: "unauthorized", error: error.message });
  }
});

module.exports = router;
