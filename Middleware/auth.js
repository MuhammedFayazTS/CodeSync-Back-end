const passport = require("passport");
const User = require("../Model/userModel");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({googleId:profile.id});

        if(!user){
          user = new User({
            googleId:profile.id,
            username:profile.displayName,
            email:profile.emails[0].value,
            image:profile.photos[0].value
          })

          await user.save();
        }
        
        return cb(null,user)

      } catch (error) {
        return cb(error,null)
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});