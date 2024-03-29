// server.js

'use strict';

// Imports the Google Cloud client library
const Language = require('@google-cloud/language');

// Your Google Cloud Platform project ID
const projectId = 'bitcampNLP';

// Instantiates a client
const languageClient = Language({
	projectId: projectId
});


// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration ===========================================


// set our port
var port = process.env.PORT || 8000; 

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 

app.post('/nlp', function (req, res) {
	var text = req.body.text;

	//console.log(params)
	if(text){
		// Detects the entities of the text
		languageClient.detectEntities(text).then((results) => {
			const entities = results[0];
			console.log('Entities:');
			for (let type in entities) {
				console.log(`${type}:`, entities[type]);
			}
			res.status(200).send(entities);;
		});
	}else{
		res.status(404).send("You done fucked up A-ARON");;
	}

});

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8000
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;         