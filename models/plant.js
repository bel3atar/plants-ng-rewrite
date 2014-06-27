var mongoose = require('mongoose'), ObjectId = mongoose.Schema.Types.ObjectId;	
var schema = new mongoose.Schema({
	pmup : {type: Number, default: 0},
	name : String,
	desc : String,
	image: String,
	lots: [{
		_id     : {auto: true, type: mongoose.Schema.Types.ObjectId, index: true},
		price   : Number,
		quantity: Number,
		date    : Date,
		seller  : {name: String, tel: String},
		outs: [{ //sortie vers production du lot
			date : Date,
			raw: Number,
			net: Number,
			_id: {auto: true, type: mongoose.Schema.Types.ObjectId, index: true},
			finals: [{
				_id: {auto: true, type: mongoose.Schema.Types.ObjectId, index: true},
				// package: {type: ObjectId, ref: 'Package' },
				// weight: Number,
				retail: Number,
				quantity: Number,
				// cost: Number,
				date: Date,
				name: String
			}]
		}]
	}]
});
module.exports = mongoose.model('Plant', schema);
