/**
 * If you want to keep configs in this file, set configType = 'file' and fill in the URLs for
 * slackUnderperforming, slackViral and postsApiUrl.
 * Alternatively, make configType = 'env' and set the same values as environment variables
 */

var configType = 'env', 		// file / env
	config = {},
	env = 'dev'; 				// dev, prod

if (configType == 'file') {
	if (env == 'prod') {
		// To #editorial
		config.slackUnderperforming = '';
		config.slackViral = '';
	} else {
		// To #test2
		config.slackUnderperforming = '';
		config.slackViral = '';
		config.debug = true;
	}
	config.postsApiUrl = '';
} else {
	config.slackUnderperforming = process.env.slackUnderperforming;
	config.slackViral = process.env.slackViral;
	config.debug = false;
	config.postsApiUrl = process.env.postsApiUrl;
}

module.exports = config;
