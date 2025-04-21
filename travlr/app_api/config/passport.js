// app_api/config/passport.js
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/user');  // exports the mongoose model

passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  async (email, password, done) => {
    try {
      // Mongoose 7+ no longer accepts callbacks, so await the query instead
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }

      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }

      // success!
      return done(null, user);

    } catch (err) {
      // any db error
      return done(err);
    }
  }
));
