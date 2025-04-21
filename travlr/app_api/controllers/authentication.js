// app_api/controllers/authentication.js
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user');

/**
 * POST /api/register
 */
const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'All fields required' });
  }

  try {
    const user = new User();
    user.name  = name;
    user.email = email;
    user.setPassword(password);

    // Await save → no callback
    await user.save();

    // Issue JWT
    const token = user.generateJwt();
    return res
      .status(200)
      .json({ token });
  } catch (err) {
    // e.g. duplicate key, validation errors
    return res
      .status(400)
      .json(err);
  }
};

/**
 * POST /api/login
 */
const login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: 'All fields required' });
  }

  passport.authenticate('local', (err, user, info) => {
    // DEBUG: inspect Passport’s result
    console.log('Passport callback err:', err, 'user:', user, 'info:', info);

    if (err) {
      return res
        .status(500)
        .json({ message: err.message || 'Authentication error' });
    }
    if (!user) {
      // credentials invalid
      return res
        .status(401)
        .json({ message: info && info.message ? info.message : 'Invalid credentials' });
    }

    // success → issue token
    const token = user.generateJwt();
    return res
      .status(200)
      .json({ token });
  })(req, res, next);  // ← pass `next` so Passport can complete
};

module.exports = {
  register,
  login
};
