var router = require('express').Router();
var utils = require('../lib/utils');

router.get('/', function (req, res) {
	utils.conlog(req.method, req.url);
	res.status(200).send('Node API home page');
});

module.exports = router;
