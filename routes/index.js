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
    res.render("user", {twib: data});
  })
  .catch(function(err) {
    res.render("problem", {error: err});
  })
});

//****Write a new twib****//
// TODO create error validation for over 140 //
router.post("/create", function(req, res) {
  // console.log("POST LENGTH ", req.body.post.length);
  models.Twib.create({
    post: req.body.post,
    userId: req.user.id
  })
  .then(function(data) {
    // console.log("******PASSPORT.USER: ", req.session.passport.user);
    // console.log("******TWIB INFO: ", models.Twib);
    res.redirect("/user");
  })
  .catch(function(err) {
    // console.log("ERROR IN POST :", err);
    res.render("problem", {error: err});
  });
});

//****Like a twib****//
router.get("/like/:id", function(req, res) {
  models.Twib.findOne({
    where: {id: req.params.id},
    include: [
      {model: models.Like, as: 'Likes'},
    ]
  })
  .then(function(twib) {
    models.Like.create({
      userId: req.user.id,
      twibId: twib.id
    })
    .then(function(data) {
      res.redirect("/user");
    })
    .catch(function(err) {
      res.render("problem", {error: err})
    })
  })
  .catch(function(err) {
    res.render("problem", {error: err})
  })
});

//****View twib info and likes****//
//TODO need to display names of likers//
router.get("/view/:id", function(req, res) {
  models.Twib.findOne({
    where: {id: req.params.id},
    include: [
      {model: models.User, as: 'Users'},
      {model: models.Like, as: 'Likes'}
    ]
  })
  .then(function(data) {
    //
    // let arr = []
    //
    // data.Likes.forEach(function(user) {
    //   arr.push(userId)
    // })
    //
    // models.User.findAll({ where: { id: arr } })


    res.render("view", {twib: data})
  })
  .catch(function(err) {
    res.render("problem", {error: err});
  })
});


//****User can delete own twibs****//
router.get("/delete/:id", function(req, res) {
  models.Twib.findOne(
    {where: {id: req.params.id}}
  )
  .then(function(twib) {
    if(twib.userId === req.user.id) {
      models.Twib.destroy(
        {where: {id: req.params.id}}
      )
      .then(function(data) {
        res.redirect("/user");
      })
    } else {
      res.render("problem", {error: "You can't delete this message."})
    }
  })
  .catch(function(err) {
    res.render("problem", {error: err});
  })
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
