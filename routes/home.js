var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	console.log(req.method, req.url);
	res.send('I\'m the home page');
});

module.exports = router;
