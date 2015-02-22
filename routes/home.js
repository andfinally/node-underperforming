var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/', function (req, res) {
	console.log(req.method, req.url);
	var now = moment();
	res.status(200).send('Underperforming API home page');
});

module.exports = router;
