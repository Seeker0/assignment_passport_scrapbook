const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
var mongoose = require("mongoose");
var models = require("./models");
var User = mongoose.model("User");



passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username }, function(err, user) {
      console.log(user);
      if (err) return done(err);
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Invalid username/password' });
      }
      return done(null, user);
    });
  })
);


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/login/facebook/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile)
    console.log(cb)
    let username = profile.displayName;
    try {
      let user = await User.findOrCreate({ facebookId: profile.id }, username);
      console.log(user);
      return cb(null, user);
    } catch (e) {
      cb(e);
    }
  }
));



module.exports = passport;