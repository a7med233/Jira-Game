const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token)
    return res.status(401).json({ message: 'Access denied, token missing!' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

router.post('/update', authenticateToken, async (req, res) => {
  const { score } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.highScore === 0 || score < user.highScore) {
      user.highScore = score;
      await user.save();
    }
    res.json({ highScore: user.highScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;