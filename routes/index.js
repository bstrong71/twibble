const express = require("express");
const models = require("../models/index");
const router = express.Router();
const bcrypt = require("bcrypt");

const passport = require('passport');

//** Middleware to verify logged in **//
const isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/')
  }

router.get("/", function(req, res) {
  res.render("signin", {
      messages: res.locals.getMessages()
  });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signin");
});

router.post("/signup", function(req, res) {
  let display_name = req.body.display_name;
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    req.flash('error', "Please, fill in all the fields.")
    res.redirect('signin')
  }
  let salt = bcrypt.genSaltSync(10)
  let hashedPassword = bcrypt.hashSync(password, salt)
  let newUser = {
    display_name: display_name,
    username: username,
    salt: salt,
    password: hashedPassword
  }

  models.User.create(newUser).then(function() {
    res.redirect('/');
  }).catch(function(error) {
    req.flash('error', "Please, choose a different username.")
    res.redirect('/signup')
  });
});

router.get("/user", isAuthenticated, function(req, res) {
  models.Twib.findAll({
    order: [['createdAt', 'DESC']],
    include: [
      {model: models.User, as: 'Users'},
      {model: models.Like, as: 'Likes'}
    ]
  })
  .then(function(data) {
    console.log("THIS IS DATA ", data);
    res.render("user", {twib: data});
  })
  .catch(function(err) {
    console.log("FAILED ", err);
  })
});

router.post("/create", function(req, res) {
  models.Twib.create({
    post: req.body.post,
    userId: req.user.id
  })
  .then(function(data) {
    res.redirect("/user");
  })
  .catch(function(err) {
    res.redirect("/");
  });
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
