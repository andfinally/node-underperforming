var router = require('express').Router();

router.get('/', function (req, res) {
	console.log(req.method, req.url);
	res.status(200).send('Node API home page');
});

module.exports = router;
