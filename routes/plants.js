var Plant = require('../models/plant');
module.exports = function (app) {
	//show
	app.get('/plants/:plant', function (req, res, next) {
		Plant.findById(req.params.plant, function (err, plant) {
			if (err || !plant) next(err);
			else res.json(plant);
		});
	});
	//index
	app.get('/plants', function (req, res, next) {
		Plant.find({}, 'pmup image name desc _id', function (err, plants) {
			if (err) next(err);
			else res.json({plants: plants});
		});
	});
	//create
	app.post('/plants', function (req, res, next) {
		console.log(req);
		new Plant({
			name: req.body.name,
			desc: req.body.desc,
			image: req.files.file.name
		}).save(function (err, pl) {
			if (err) next(err);
			else res.send(200);
			console.log(pl + ' saved to db');
		});
	});
	//delete
	app.delete('/plants/:plant', function (req, res, next) {
		Plant.findByIdAndRemove(req.params.plant, function (err, pl) { 
			if (err) next(err);
			else {
				console.log('plant removed from db, trying to delete its image file');
				require('fs').unlink('./public/images/' + pl.image, function (uerr) {
					if (uerr) {
						console.error(uerr);
						next(uerr);
					} else {
						console.log('image file deleted');
						res.send(200);
					}
				});
			}
		});
	});
	//update
	app.put('/plants/:plant', function (req, res, next) {
		var update = req.files.pic.name ? {
				name: req.body.name,
				desc: req.body.desc,
				image: req.files.pic.name
		} : {
				name: req.body.name,
				desc: req.body.desc,
		};
		Plant.findByIdAndUpdate(req.params.plant, update, function (err, plant) {
				if (err) next(err);
				else res.redirect('/plants');
			}
		);
	});
	//sub-resources
	require('./lots.js')(app);
	require('./outs.js')(app);
};
