const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const middleware = require('./middleware')
const app = express()
const db = {
	findUser:function (username, callback) {
	  const user = {
		  username: 'user',
		  password: 'user',
		  id: 1
		}

	  if (username === user.username) {
		return callback(null, user)
	  }
	  return callback(null)
	}
}

middleware.init(db);
middleware.register(app);


app.engine('.hbs', exphbs({
  defaultLayout: 'hbs/layout',
  extname: '.hbs',
  layoutsDir: path.join(__dirname),
  partialsDir: path.join(__dirname)
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname));
app.get('/', (req, res) => {
  res.render('hbs/welcome');
});
app.get('/profile', middleware.auth, (req, res) => {
  res.render('hbs/profile', {
	username: req.user.username
  });
});

module.exports = app;
