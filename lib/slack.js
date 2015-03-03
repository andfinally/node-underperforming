var config = require('../config');
var request = require('request');
var utils = require('./utils');

// Send post request to Slack incoming webhook URL
var send = function (webhook, payload) {
	var slackUrl = process.env.slackUnderperforming || config.slackUnderperforming;
	if (webhook == 'viral') {
		slackUrl = process.env.slackViral || config.slackViral;
	}
	request({
		uri   : slackUrl,
		method: 'POST',
		body  : payload
	}, slackCallback);
};

var slackCallback = function (error, response, body) {
	if (error) {
		utils.conlog('Slack request error ' + error);
	} else if (response.statusCode !== 200) {
		utils.conlog(new Error('Incoming WebHook: ' + response.statusCode + ' ' + body));
	}
};

module.exports.send = send;
