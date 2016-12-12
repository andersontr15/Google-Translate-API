var express = require('express');
var bodyParser = require('body-parser');
var httpRequest = require('request');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(require('morgan')('dev'));

app.set('view engine', 'ejs');

app.post('/search', function(request, response) {
		if(!request.body.query) {
			return response.status(400).send('Invalid data supplied!');
		}
		httpRequest('https://translation.googleapis.com/language/translate/v2?source=en&target=es&q=' + request.body.query + '&key=AIzaSyAdwhsZBwwI227Dyioqr3TxIApgeUtPh64', function(err, responseCode, body) {
			if(err) {
				return response.status(400).send(err)
			}
			var parsed = JSON.parse(body);
			var text = parsed.data.translations[0].translatedText;
			return response.render('results.ejs', {translation: text, source: request.body.query})
		})
});

app.get('/', function(request, response) {
	response.render('search.ejs', {
		message: 'Search'
	})
});

app.listen(8000, function() {
	console.log('Listening on port 8000');
});