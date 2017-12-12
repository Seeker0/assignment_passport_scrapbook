var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");
var User = mongoose.model("User");
var passport = require('./../passportConfig');








router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);


router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("FACEBOOK RESPONSE")
    console.log(req);
    console.log(req.body);
    res.redirect('/');
  }
);

router.get('/', (req, res) => {
  res.render('welcome/login');
});
module.exports = router;