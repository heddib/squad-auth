var http = require('http');

var app = require('./app');

var port = process.env.PORT || 3000; 	  // set our port
var host = process.env.HOST || 'localhost'; // For Heroku to run successfully

http.createServer(app).listen(port, () => {
	console.log("Listening on port " + port);
});