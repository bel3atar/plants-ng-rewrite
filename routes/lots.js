var Plant = require('../models/plant'), 
		OId = require('mongoose').Types.ObjectId;
module.exports = function (app) {
	//informations sur le lot
	app.get('/lots/:lot', function (req, res, next) {
		console.log(req.params.lot);
		Plant.aggregate(
			{$unwind: '$lots'},
			{$match: {'lots._id': new OId(req.params.lot)}},
			{$project: {'lots.outs': 1, 'lots.quantity': 1, name: 1}},
			{$unwind: '$lots.outs'},
			{$group: {
				_id: {plant: '$name', quantity: '$lots.quantity'},
				totalOuts: {$sum: '$lots.outs.raw'}
			}}
		).exec(function (err, data) {
			if (err) next(err);
			else if (!data) next();
			else {
				var o = data[0];
				res.json({
					plant: o._id.plant, quantity: o._id.quantity, out: o.totalOuts
				});
			}
		});
	});
	//outs index
	app.get('/lots/:lot/outs', function (req, res, next) {
		Plant.findOne({'lots._id': req.params.lot}, {'lots.$.outs': 1, name: 1},
			function (err, data) {
				if (err) next(err);
				else if (!data) next();
				else res.json(data);
			}
		);
	});
	//outs create
	app.post('/lots/:lot/outs', function (req, res, next) {
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
	app.get('/plants/:plant/lots', function (req, res, next) {
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
	app.post('/plants/:plant/lots', function (req, res, next) {
		Plant.findByIdAndUpdate(req.params.plant, 
		{$push: {lots: {
				date: req.body.date,
				quantity: req.body.quantity,
				price: req.body.price,
				seller: {
					name: req.body.seller.name,
					tel: req.body.seller.tel
				}
		}}},
		{pmup:  function (err, item) {
			if (err) next(err);
			else if (!item) next();
			else res.send(200);
		});
	});
};
