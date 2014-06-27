var Plant = require('../models/plant');
module.exports = function (app) {
	app.get('/api/outs/:out/finals', function (req, res, next) {
		Plant.findOne({'lots.outs._id': req.params.out}, function (err, plant) {
			var obj = {
				plantId: plant._id,
				plantName: plant.name,
				lotId: plant.lots[0]._id,
				outId: plant.lots[0].outs[0]._id,
				outDate: plant.lots[0].outs[0].date,
				finals: plant.lots[0].outs[0].finals
			};
			res.json(obj);
		});
	});
	app.post('/api/outs/:out/finals', function (req, res, next) {
		var obj = req.body;
		obj.sold = false;
		Plant.findOneAndUpdate(
			{'lots.outs._id': new require('mongoose').Types.ObjectId(req.params.out)},
			{$push: {'lots.0.outs.0.finals': obj}}, 
			function (err, doc) { 
				if (err) next(err);
				else res.send(200);
			}
		);
	});
	app.post('/api/finals/:final/sell', function (req, res, next) {
		console.log(req.body);
		Plant.findOneAndUpdate(
			{'lots.outs.finals._id': req.params.final},
			{$inc: {'lots.0.outs.0.finals.0.quantity': -req.body.howmuch}},
			function (err, item) {
				if (err) next(err);
				else res.send(200);
			}
		);
	});
	app.get('/api/outs/:out', function (req, res, next) {
		var id = req.params.out;
		Plant.aggregate(
			{$project: {'lots.outs': 1, _id: 0}},
			{$unwind: '$lots'},
			{$unwind: '$lots.outs'},
			{$match: {'lots.outs._id': id}},
			function (err, item) {
				if (err) next(err);
				else if (!item) next();
				else res.json(item);
			}
		);
	});
};
