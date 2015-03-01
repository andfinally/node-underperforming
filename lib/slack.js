var config = require('../config');
var request = require('request');

// Send post request to Slack incoming webhook URL
var send = function (webhook, payload) {
	var slackUrl = config.slackUnderperforming;
	if (webhook == 'viral') {
		slackUrl = config.slackViral;
	}
	request({
		uri   : slackUrl,
		method: 'POST',
		body  : payload
	}, slackCallback);
};

var slackCallback = function (error, response, body) {
	if (error) {
		conlog('Slack request error ' + error);
	} else if (response.statusCode !== 200) {
		conlog(new Error('Incoming WebHook: ' + response.statusCode + ' ' + body));
	}
};

module.exports.send = send;
