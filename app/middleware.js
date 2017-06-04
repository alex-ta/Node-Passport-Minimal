const config = require('../config');
const store_url = config.store.require || 'connect-mongo';
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const Store = require(store_url)(session);
const connect = require('mongoose').connect;

const init = function(db){
	// all attributes passed in the session
	atts = config.session.atts || ["username"];
	// the key to find the user in the database
	key = config.session.key || "username";
	
	passport.serializeUser(function (user, done) {
	  const session_data = {}
	  // set configured data in session
	  atts.forEach( (key)  => {
		session_data[key] = user[key];
	  });
	  done(null, session_data);
	});

	passport.deserializeUser(function (session_data, done) {
	  // use configured data to load user from session
	  db.findUser(session_data[key], done);
	});

	passport.use(new LocalStrategy(
		// post sends the username could also be an id or so
		function(username, password, done) {
			// finds the user matching to passed value from post
		  db.findUser(username, function (err, user) {
			if (err) {
			  return done(err);
			}
			if (!user || (password !== user.password)) {
			  return done(null, false);
			}
			return done(null, user);
		  });
		}
	));
}

const auth = function (req, res, next) {
	failure = config.url.failure || '/';
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect(failure);
}
	
const register = function(app){
	logout = config.url.logout || '/logout';
	login = config.url.login ||'/login';
	success = config.url.success || '/';
	failure = config.url.failure || '/';
	
	app.use(bodyParser.urlencoded({
	  extended: false
	}))

	app.use(session({
	  store: new Store({
		 url: config.session_database.url,
	  }),
	  secret: config.session_database.secret,
	  resave: false, // save every request or just change
	  saveUninitialized: true // save the new session even if it has not changed
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	app.get(logout, (req, res) => {
		req.logout();
		req.session.destroy();
		res.redirect(failure);
	});
	app.post(login, passport.authenticate('local', {
		successRedirect: success,
		failureRedirect: failure
	}));
}

module.exports = {init:init,register:register, auth:auth};