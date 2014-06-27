var mongoose = require('mongoose');
var schema = new mongoose.Schema({
	name: String,
	tel: String
});
module.exports = mongoose.model('Customer', schema);
