const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var models = require('./models');
var User = mongoose.model('User');

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

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/login/facebook/callback',
      profileFields: ['id', 'displayName', 'name', 'gender', 'photos', 'email']
    },
    async function(accessToken, refreshToken, profile, cb) {
      // console.log(accessToken);
      // console.log(refreshToken);
      console.log(profile);
      // console.log(cb);
      let username = profile.displayName;
      try {
        let user = await User.findOrCreate({ email: profile.emails[0].value });
        let photos = [];
        profile.photos.forEach(photoObj => {
          photos.push(photoObj.value);
        });
        user.facebookId = profile.id;
        user.facebookPhotos = photos;
        user = await user.save();
        return cb(null, user);
      } catch (e) {
        cb(e);
      }
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.CONSUMER_KEY,
      consumerSecret: process.env.CONSUMER_SECRET,
      callbackURL: 'http://localhost:3000/login/twitter/callback'
    },
    async function(token, tokenSecret, profile, cb) {
      console.log(`TWITTER CALLBACK FUNCTION`);
      console.log(profile);
      let user = await User.findOrCreate({ twitterId: profile.id });
      let photos = [];
      profile.photos.forEach(photoObj => {
        photos.push(photoObj.value);
      });
      user.twitterPhotos = photos;
      await user.save();
      return cb(null, user);
    }
  )
);

let YoutubeV3Strategy = require('passport-youtube-v3').Strategy;

passport.use(
  new YoutubeV3Strategy(
    {
      clientID: process.env.YOUTUBE_ID,
      clientSecret: process.env.YOUTUBE_SECRET,
      callbackURL: 'http://localhost:3000/login/youtube/callback',
      scope: ['https://www.googleapis.com/auth/youtube.readonly']
    },
    async function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      let user = await User.findOrCreate({ email: profile.displayName });
      user.userName = 'Rufio';
      await user.save();
      return done(null, user);
    }
  )
);

module.exports = passport;
