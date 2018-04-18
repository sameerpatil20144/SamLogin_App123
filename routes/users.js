var express = require('express')
var router = express.Router()
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy


var User = require('../models/user');


// register
router.get('/register',function (req,res) {
	// body...
	res.render('register')
})


// login
router.get('/login',function (req,res) {
	// body...
	res.render('login')
})

// register User Post
router.post('/register',function (req,res) {
	// body...
	console.log(req.body)
	// return res.json({type:true,data:req.body});
	var name = req.body.name
	var username = req.body.username
	var email = req.body.email
	var password = req.body.password
	var password2 = req.body.password2

	// console.log(name)
	// console.log(username)
	// console.log(email)
	// console.log(password)
	// console.log(password2)

	// validation
	req.checkBody('name','Name is required').notEmpty()
	req.checkBody('email','email is required').notEmpty()
	req.checkBody('email','email is not valid').isEmail()
	req.checkBody('username','username is required').notEmpty()
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors()

	if(errors){
		// res.render('register',{
		// 	errors:errors
		// });
		// return res.json({type:false,error:errors})
	}
	else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			// return res.json({type:true,user:user});
			console.log(user);
		});


		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/');
	}

})
// passportjs.org(username password)
passport.use(new LocalStrategy(
  function(username, password, done) {
   	console.log(username);
 	
   User.getUserByUsername(username, function(err, user){
   	if(err) console.log(err);
   	// console.log(user)

   	// if no matches
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	// else matches 
   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

// config (passportjs.org) 
// for  making session and  storing cookies
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


// passportjs.org
router.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/users/login',failureFlash:true }));


router.get('/logout',function (req,res) {
	// body...
	req.logout()
	req.flash('success_msg','You are logged out!')
	res.redirect('/users/login')
})

module.exports = router;