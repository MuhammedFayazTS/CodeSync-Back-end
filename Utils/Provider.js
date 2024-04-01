const passport = require("passport");
const User = require("../Model/userModel");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require('bcrypt');


const connectPassport = () => {
  // google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = new User({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              image: profile.photos[0].value,
            });

            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });

  // passport local strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email" }, // Use 'email' as the username field
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false);
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

};

module.exports = connectPassport;
