require('mongoose').connect('mongodb://localhost/plants');

var app = require('express')(), secret = '*@Ccn083#$%89v_8n-M*ewfnw!_+';

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

require('./middleware')(app, secret);
require('./auth')(app, secret);

require('./routes/plants')(app);
require('./routes/users')(app);

app.get('/partials/:partial', function (req, res, next) {
	res.render('partials/' + req.params.partial);
});

app.get('/', function (req, res, next) {
	res.render('index');
});

app.use(function (req, res, next) {
	res.json(404, {error: 'Ressource introuvable ' + req.path});
});

app.use(function (err, rea, res, next) {
	res.json(500, {error: err});
});

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));


