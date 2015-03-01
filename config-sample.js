/**
 * Save a copy of this file as config.js
 */

var config = {};

var config = {};
var env = 'dev'; // dev, prod

if (env == 'prod') {
	config.slackUnderperforming = 'https://hooks.slack.com/xxxxxxxxxx';
	config.slackViral = 'https://hooks.slack.com/services/xxxxxxxxxx';
	config.debug = false;
} else {
	config.slackUnderperforming = 'https://hooks.slack.com/xxxxxxxxxx';
	config.slackViral = 'https://hooks.slack.com/services/xxxxxxxxxx';
	config.debug = true;
}
config.postsApiUrl = 'http://xxxxxxxxxx';

module.exports = config;
