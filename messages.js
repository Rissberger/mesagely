const express = require('express');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const Message = require('../models/message');
const router = express.Router();

// GET /:id - Get detail of message
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.get(req.params.id);
    
    // Check if the logged-in user is the sender or recipient
    if (req.user.username !== message.from_user.username && req.user.username !== message.to_user.username) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

// POST / - Post message
router.post('/', ensureLoggedIn, async (req, res, next) => {
  try {
    const { to_username, body } = req.body;
    const from_username = req.user.username; // Assuming username is stored in req.user
    const message = await Message.create({ from_username, to_username, body });

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

// POST/:id/read - Mark message as read
router.post('/:id/read', ensureLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.get(req.params.id);

    // Check if the logged-in user is the intended recipient
    if (req.user.username !== message.to_user.username) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const readMessage = await Message.markRead(req.params.id);
    return res.json({ message: readMessage });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
