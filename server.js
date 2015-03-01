var express = require('express');
var app = express();
var request = require('request');
var port = 8080;
app.use(express.static(__dirname + '/public'));

// Routes
app.use('/', require('./routes/home'));
app.use('/underperforming', require('./routes/underperforming'));
app.use('/underperforming/viral', require('./routes/viral'));

app.listen(port);
console.log('Magic happens on port ' + port);
