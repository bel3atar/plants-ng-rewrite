var Package = require('../models/package');
module.exports = function (app, io) {
	//index
	app.get('/api/packages', function (req, res, next) {
		Package.find({}, 'image name _id', function (err, packages) {
			if (err) next(err);
			else res.json({packages: packages});
		});
	});
	//delete
	app.delete('/api/packages/:package', function (req, res, next) {
		Package.findByIdAndRemove(req.params.package, function (err, pl) { 
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
	app.post('/api/packages', function (req, res, next) {
		new Package({
			name: req.body.name,
			desc: req.body.desc,
			cost: req.body.cost,
			image: req.files.file.name
		}).save(function (err, pl) {
			if (err) next(err);
			else res.send(200);
		});
	});
	//update
	app.put('/api/packages/:package', function (req, res, next) {
		var update = req.files.file.name ? {
				name: req.body.name,
				desc: req.body.desc,
				image: req.files.file.name
		} : {
				name: req.body.name,
				desc: req.body.desc,
		};
		Package.findByIdAndUpdate(req.params.package, update, function (err, pl) {
				if (err) next(err);
				else {
					require('fs').unlink('./pulibc/images/' + pl.image);
					res.send(200);
				}
			}
		);
	});
};
