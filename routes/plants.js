var Plant = require('../models/plant');
module.exports = function (app, io) {
	//show
	app.get('/api/plants/:plant', function (req, res, next) {
		Plant.findById(req.params.plant, function (err, plant) {
			if (err || !plant) next(err);
			else res.json(plant);
		});
	});
	//index
	app.get('/api/plants', function (req, res, next) {
		Plant.find({}, 'pmup image name desc _id', function (err, plants) {
			if (err) next(err);
			else res.json({plants: plants});
		});
	});
	//delete
	app.delete('/api/plants/:plant', function (req, res, next) {
		Plant.findByIdAndRemove(req.params.plant, function (err, pl) { 
			if (err) next(err);
			else {
				require('fs').unlink('./public/images/' + pl.image, function (uerr) {
					if (uerr) next(uerr);
					else res.send(200);
				});
			}
		});
	});
	//create
	app.post('/api/plants', function (req, res, next) {
		new Plant({
			name: req.body.name,
			desc: req.body.desc,
			image: req.files.file.name
		}).save(function (err, pl) {
			if (err) next(err);
			else res.send(200);
		});
	});
	//update
	app.put('/api/plants/:plant', function (req, res, next) {
		var update = req.files.file.name ? {
				name: req.body.name,
				desc: req.body.desc,
				image: req.files.file.name
		} : {
				name: req.body.name,
				desc: req.body.desc,
		};
		Plant.findByIdAndUpdate(req.params.plant, update, function (err, pl) {
				if (err) next(err);
				else {
					require('fs').unlink('./pulibc/images/' + pl.image);
					res.send(200);
				}
			}
		);
	});
	//sub-resources
	require('./lots.js')(app, io);
	require('./outs.js')(app);
};
