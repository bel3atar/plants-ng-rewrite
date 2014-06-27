var mongoose = require('mongoose');
var schema = new mongoose.Schema({
	name: String,
	role: {type: String, enum: [
			'Client',
			'Administrateur',
			'Responsable de stock',
			'Responsable de ventes',
			'Responsable de production'
	]}
});
schema.plugin(require('passport-local-mongoose'));
module.exports = mongoose.model('User', schema);
