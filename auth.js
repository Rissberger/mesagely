const express = require('express');
const User = require('../models/user'); // Adjust path as necessary
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const router = express.Router();

// POST /login - Login a user
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      const token = jwt.sign({ username }, SECRET_KEY);
      await User.updateLoginTimestamp(username);
      return res.json({ token });
    } else {
      throw new ExpressError("Invalid username/password", 400);
    }
  } catch (err) {
    return next(err);
  }
});

// POST /register - Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    const newUser = await User.register({ username, password, first_name, last_name, phone });
    if (newUser) {
      const token = jwt.sign({ username }, SECRET_KEY);
      await User.updateLoginTimestamp(username);
      return res.json({ token });
    } else {
      throw new ExpressError("Registration failed", 400);
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
