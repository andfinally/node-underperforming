/**
 * Save a copy of this file as config.js
 * If you want to keep your configs in this file, set configType = 'file' and fill in the URLs for
 * slackUnderperforming, slackViral and postsApiUrl.
 * Alternatively, make configType = 'env' and set the same values as environment variables
 */

var configType = 'file', 		// file / env
	config = {},
	env = 'dev'; 				// dev, prod

if (configType == 'file') {
	if (env == 'prod') {
		config.slackUnderperforming = 'https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXX';
		config.slackViral = 'https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXX';
		config.debug = false;
	} else {
		config.slackUnderperforming = 'https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXX';
		config.slackViral = 'https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXX';
		config.debug = true;
	}
	config.postsApiUrl = 'http://XXX.XXXXXXX.XXX';
} else {
	config.slackUnderperforming = process.env.slackUnderperforming;
	config.slackViral = process.env.slackViral;
	config.debug = false;
	config.postsApiUrl = process.env.postsApiUrl;
}

module.exports = config;
