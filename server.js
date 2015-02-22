var express = require('express');
var app = express();
var request = require('request');
var port = 8080;
app.use(express.static(__dirname + '/public'));

var routes = require('./routes')(app);

app.listen(port);
console.log('Magic happens on port ' + port);
