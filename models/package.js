var mongoose = require('mongoose');
var schema = new mongoose.Schema({
	name: String,
	desc: String,
	image: String,
	cost: Number
});
module.exports = mongoose.model('Package', schema);
