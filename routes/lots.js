var Plant = require('../models/plant'), 
		OId = require('mongoose').Types.ObjectId;
module.exports = function (app, io) {
	//informations sur le lot
	app.get('/api/lots/:lot', function (req, res, next) {
		var pipeline = [
			{$unwind: '$lots'},
			{$match: {'lots._id': new OId(req.params.lot)}},
			{$project: {'lots.outs': 1, 'lots.quantity': 1, name: 1}}
		];
		Plant.aggregate(pipeline).exec(function (err, data) {
			if (err) return next(err);
			if (!data) return next();
			data = data[0];
			var response = {plant: data.name, quantity: data.lots.quantity, out: 0};
			if (data.lots.outs.length !== 0) {
				Plant.aggregate(pipeline).append(
					{$unwind: '$lots.outs'},
					{$group: {_id: null, totalOuts: {$sum: '$lots.outs.raw'}}}
				).exec(function (err, data) {
					if (err) return next(err);
					else if (!data) return next();
					else {
						response.out = data[0].totalOuts;
						res.json(response);
					}
				});
			} else {
				res.json(response);
			}
		});
	});
	//outs index
	app.get('/api/lots/:lot/outs', function (req, res, next) {
		Plant.findOne({'lots._id': req.params.lot}, {'lots.$.outs': 1, name: 1},
			function (err, data) {
				if (err) next(err);
				else if (!data) next();
				else res.json(data);
			}
		);
	});
	//outs create
	app.post('/api/lots/:lot/outs', function (req, res, next) {
		Plant.findOneAndUpdate(
			{'lots._id': req.params.lot},
			{$push: {'lots.$.outs': req.body}},
			function (err, item) {
				if (err) res.send(404);
				else res.send(200);
			}
		);
	});
	//index
	app.get('/api/plants/:plant/lots', function (req, res, next) {
		Plant.findById(req.params.plant, 'name lots', function (err, plant) {
			if (err) next(err);
			else if (!plant) next();
			else {
				res.json({
					id: plant._id,
					name: plant.name,
					lots: plant.lots
				});
			}
		});
	});
	//lots create
	app.post('/api/plants/:plant/lots', function (req, res, next) {
		Plant.findById(req.params.plant, 'pmup lots', function (err, plant) {
			var cb = function (err, item) { 
				if (err) next(err); 
				else {
					res.send(200);
					io.emit('newLot', item.lots.pop());
				}
			};
			if (err) return cb(err);
			if (plant.pmup) {
				var somme = 0.0;
				for (var i = 0; i < plant.lots.length; ++i)
					somme += plant.lots[i].quantity;
				var pmup = 
					(somme * plant.pmup + req.body.price * req.body.quantity) /
					(somme + req.body.quantity);
				Plant.findByIdAndUpdate(
					req.params.plant,
					{
						$set: {pmup: pmup},
						$push: {lots: req.body}
					},
					cb
				);
			} else {
				Plant.findByIdAndUpdate(
					req.params.plant,
					{$set: {pmup: req.body.price}, $push: {lots: req.body}},
					cb
				);
			}
		});
	});
};
