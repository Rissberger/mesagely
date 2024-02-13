const express = require('express');
const User = require('../models/user'); 
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const router = express.Router();

router.use(ensureLoggedIn);

// GET / - List of users, accessible by any logged-in user
router.get('/', async (req, res, next) => {
  try {
    const users = await User.all();
    return res.json({ users });
  } catch (err) {
    next(err);
  }
});

// GET /:username - Detail of user, accessible only by the user themselves
router.get('/:username', ensureCorrectUser, async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    next(err);
  }
});

// Middleware to ensure the logged-in user matches the requested username
function ensureCorrectUser(req, res, next) {
  if (req.user.username !== req.params.username) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

module.exports = router;
