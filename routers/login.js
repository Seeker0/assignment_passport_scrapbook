var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('./../models');
var User = mongoose.model('User');
var passport = require('./../passportConfig');

router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/facebook', passport.authenticate('facebook', {
  authType: 'rerequest',
  scope: ['user_friends', 'email', 'public_profile'],
}));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
    // console.log('FACEBOOK RESPONSE');
    // console.log(req);
  }
);


router.get('/twitter', passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
    // console.log('FACEBOOK RESPONSE');
    // console.log(req);
  }
);

router.get('/', (req, res) => {
  res.render('welcome/login');
});
module.exports = router;