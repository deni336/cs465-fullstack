// app_api/routes/index.js
const express = require('express');
const router  = express.Router();

// ─── Log every API request ─────────────────────────────────────────────────
router.use((req, res, next) => {
  console.log(`👉 API Request: ${req.method} ${req.originalUrl}`);
  next();
});

const jwt = require('express-jwt');
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
  algorithms: ['HS256']
});

const authController  = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

router
  .route('/login')
  .post(authController.login);

router
  .route('/register')
  .post(authController.register);

router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(auth, tripsController.tripsAddTrip);

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(auth, tripsController.tripsUpdateTrip);

module.exports = router;
