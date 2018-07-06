var express = require('express');
var mongoose = require('mongoose');
var passport                = require("passport");
var LocalStrategy           = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");
var router = express.Router();
var User = require('../models/user');

// //GET home page.
// router.get('/', function ( req, res, next ){
//   res.render( 'index', {title: 'login example'});
// });
//
// router.post('/create', function(req, res, next) {
//   console.log(req.body);
//   if (req.body.email &&
//   req.body.username &&
//   req.body.password &&
//   req.body.passwordConf) {
//   var userData = {
//     email: req.body.email,
//     username: req.body.username,
//     password: req.body.password,
//     passwordConf: req.body.passwordConf,
//   }
//
//   //use schema.create to insert data into the db
//   User.create(userData, function (err, user) {
//     if (err) {
//       return next(err)
//     } else {
//       req.session.userID = user._id;
//       return res.redirect('/profile');
//     }
//   });
// }
// });

router.get("/",function(req,res){
    res.render("home");
});

router.get("/secret", function(req, res){
    console.log("log in successful");
    res.render("secret");
});

// Auth Routes

router.get("/register", function(req, res){
    res.render("register");
});
//handling user sign up
router.post("/register", function(req, res){
  if (req.body.password !== req.body.passwordConf) {
    console.log("Passwords do not match");
    return res.render('register');
  }
User.register(new User({username:req.body.username, email:req.body.email}),req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render('register');
        } //user stragety
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret"); //once the user sign up
       });
    });
});

// Login Routes

router.get("/login", function(req, res){
    res.render("login");
})

// middleware
router.post("/login", passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req, res){
    res.send("User is "+ req.user.id);
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    console.log("NOOOoo going to login page");
    res.redirect("/login");
}

router.get("/logout", function(req, res){
     req.logout();
     res.redirect("/");
});


module.exports = router;
