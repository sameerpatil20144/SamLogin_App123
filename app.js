var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
// var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sam-init');
var db = mongoose.connection

var routes = require('./routes/index')
var users = require('./routes/users')

// init app
var app = express();

// view-engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}))
app.set('view engine', 'handlebars');

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// express-session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
  
}))

// expressValidator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//passport init
app.use(passport.initialize()) 
app.use(passport.session()) 


// flash
app.use(flash())

// global bars

app.use(function (req,res,next) {
	// body...
	res.locals.success_msg= req.flash('success_msg')
	res.locals.error_msg= req.flash('error_msg')
  res.locals.error= req.flash('error')
	res.locals.user= req.user || null
	next()
})

app.use('/',routes)
app.use('/users',users)


app.set('port',(process.env.PORT || 3000))
app.listen(app.get('port'),function () {
	// body...
	console.log("hello See Ur Browser" +app.get('port'))
})

