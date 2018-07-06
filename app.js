var express                 = require("express");
var mongoose                = require("mongoose");
var path                    = require('path');
var passport                = require("passport");
var bodyParser              = require("body-parser");
var User                    = require("./models/user");
var LocalStrategy           = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index.js');

var app = express();

mongoose.connect("mongodb://localhost/auth_demo_app");


// mongoose.connect( 'mongodb://localhost/auth_demo_app', {}).then(
//   () => { console.log("Connected");/** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
//   err => { console.log(err);}
// );

// console.log("Required db");
// //use sessions for tracking logins
// app.use(session({
//   secret: 'work hard',
//   resave: true,
//   saveUninitialized: false,
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection
//   })
// }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
      secret:"Hello World, this is a session",

      store: new MongoStore({
        mongooseConnection: mongoose.connection
     })
}));

app.use('/', indexRouter);

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});

module.exports = app;
