require('mongoose').connect('mongodb://localhost/plants');
var path = require('path');
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(require('morgan')({format: 'dev'}));
app.use(require('body-parser')());
app.use(require('multer')({dest: './public/images/'}));
app.use(require('method-override')());

app.use(express.static(path.join(__dirname, 'public')));
app.get('/partials/:partial', function (req, res, next) {
	res.render('partials/' + req.params.partial);
});
require('./routes/plants')(app);
require('./routes/users')(app);

app.get('/', function (req, res, next) {
	res.render('index');
});
if ('development' == app.get('env')) {
	app.locals.pretty = true;
  app.use(require('errorhandler')());
}
app.use(function (req, res, next) {
	res.json(404, {error: 'Ressource introuvable ' + req.path});
});
app.use(function (err, rea, res, next) {
	res.json(500, {error: err});
});

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));


