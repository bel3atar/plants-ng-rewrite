var passport = require('passport');
module.exports = function (app, secret) {
	app.use(require('morgan')({format: 'dev'}));
	app.use('/api', require('express-jwt')({secret: secret}));
	app.use(require('body-parser')());
	app.use(passport.initialize());
	app.use(require('multer')({dest: './public/images/'}));
	app.use(require('method-override')());
	app.use(require('express').static(require('path').join(__dirname, 'public')));
	if ('development' === app.get('env')) app.use(require('errorhandler')());
};
