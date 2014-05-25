var passport = require('passport')
  , User = require('./models/user')
	, jwt = require('jsonwebtoken');
module.exports = function (app, secret) {
	passport.use(User.createStrategy());
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());
	app.post('/login', passport.authenticate('local'), function (req, res) {
		res.json(
			{token: jwt.sign({name: req.user.name, role: req.user.role}, secret)}
		);
	});
	// app.get('/logout', function (req, res) {
	// 	req.logout();
	// 	res.send(200);
	// });
};
