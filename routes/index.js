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
  console.log("GOT THE DATA FROM FORM!!!!!!!!");
  console.log(req.body.display_name, req.body.username, req.body.password);

  if (!username || !password) {
    req.flash('error', "Please, fill in all the fields.")
    res.redirect('signin')
  }
  let salt = bcrypt.genSaltSync(10)
  let hashedPassword = bcrypt.hashSync(password, salt)
  console.log("CREATED HASHES..........");
  let newUser = {
    display_name: display_name,
    username: username,
    salt: salt,
    password: hashedPassword
  }

  console.log("ALL VARIABLES SET.........");
  models.User.create(newUser).then(function() {
    console.log("CREATING USER.........");
    res.redirect('/');
  }).catch(function(error) {
    console.log("THERE WAS AN ERROR CREATING!!!!!", error);
    req.flash('error', "Please, choose a different username.")
    res.redirect('/signup')
  });
});

router.get("/user", isAuthenticated, function(req, res) {
  console.log("GOING TO /USER.....");
  models.Twib.findAll({
    // order: ['createdAt', 'DESC']
  })
  .then(function(data) {
    console.log("RENDERING TWIB DATA ", data);
    res.render("user", {twib: data});
  })
  .catch(function(err) {
    console.log("COULDN'T RENDER USER ", err);
  })
});

router.post("/create", function(req, res) {
  models.Twib.create({
    post: req.body.post,
    userId: req.user.id
  })
  .then(function(data) {
    console.log("THIS IS /CREATE .THEN");
    res.redirect("/user");
  })
  .catch(function(err) {
    console.log("THIS IS /CREATE .CATCH");
    console.log(err);
    res.redirect("/");
  });
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
