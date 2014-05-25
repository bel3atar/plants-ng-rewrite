var User = require('../models/user');
module.exports = function (app) {
	//show
	app.get('/api/users/:user', function (req, res, next) {
		User.findById(req.params.user, 'name role username', function (err, u) {
			if (err) next(err);
			else if (!u) next();
			else res.json(u);
		});
	});
	//index
	app.get('/api/users', function (req, res, next) {
		User.find({}, 'name role username', function (err, users) {
			if (err) next(err);
			else res.json(users);
		});
	});
	//create
	app.post('/api/users', function (req, res, next) {
		User.register(new User({
			name: req.body.name,
			role: req.body.role,
			username: req.body.username
		}), req.body.password, function (err, user) {
			if (err) next(err);
			else res.send(200);
		});
	});
	//delete
	app.delete('/api/users/:user', function (req, res, next) {
		User.findByIdAndRemove(req.params.user, function (err, pl) { 
			if (err) next(err);
			else res.send(200);
		});
	});
	//update
	app.put('/api/users/:user', function (req, res, next) {
		User.findById(req.params.user, function (err, user) {
			function go(user) {
				user.save(function (err, user, aff) {
					if (err) next(err);
					else res.send(200);
				});
			}
			user.role = req.body.role;
			user.name = req.body.name;
			if (req.body.password)
				user.setPassword(req.body.password, go.bind(null, user));
			else
				go(user);
		});
	});
};
