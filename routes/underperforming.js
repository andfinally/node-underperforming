var config = require('../config');
var router = require('express').Router();
var request = require('request');
var moment = require('moment');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var schedule = require('node-schedule');
var slack = require('../lib/slack');
var utils = require('../lib/utils');

// Scheduled task for Slack notifications
var rule = new schedule.RecurrenceRule();
rule.minute = [0, 30];
var j = schedule.scheduleJob(rule, function () {
	utils.conlog('underperforming | Scheduled job starting');
	getLatestPosts(null, true);
});

// JSON output of results
router.get('/', function (req, res) {
	utils.conlog('underperforming | URL request for JSON | /');
	getLatestPosts(res, false);
});

// Triggers Slack notification on demand
router.get('/slack', function (req, res) {
	utils.conlog('underperforming | URL request for Slack notification | /slack');
	getLatestPosts(null, true);
	res.status(200).send('SLACK');
});

// Grab latest posts from the newsfeed API
function getLatestPosts(res, tellSlack) {
	var postsApiurl = process.env.postsApiUrl || config.postsApiUrl;
	request(postsApiurl, function (apiError, apiResponse, apiBody) {
		utils.conlog('underperforming | Newsfeed API response ' + apiResponse.statusCode);
		if (!apiError) {
			var outPosts = getList(apiBody);
			if (res) {
				// Output JSON response
				res.setHeader('Content-Type', 'application/json');
				res.header('Access-Control-Allow-Origin', '*');
  				res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
				res.send(outPosts);
			}
			if (tellSlack && outPosts.posts.length) {
				// Tell Slack
				utils.conlog('underperforming | Slack notification');
				slack.send('underperforming', makeSlackPayload(outPosts.posts));
			}
		} else {
			utils.conlog('underperforming | Newsfeed API error ' + apiError);
			res.status(500).send('underperforming - Newsfeed API error');
		}
	});
}

// Pick the posts between 60 and 90 mins old with views less than 1,000
function getList(body) {
	var postsJSON = JSON.parse(body),
		inPosts = postsJSON.posts,
		outPosts = {},
		now = moment(),
		earlier = now.clone(),
		hourAgo = now.clone();

	outPosts.posts = [];
	earlier = earlier.subtract(90, 'minutes');
	hourAgo = hourAgo.subtract(1, 'hour');

	for (var i = 0; i < 10; i++) {
		var postDate = moment(inPosts[i].date);
		if (postDate.isBetween(earlier, hourAgo) && inPosts[i].metrics.views < 1000) {
			inPosts[i].age = now.diff(postDate, 'minutes') + ' mins';
			outPosts.posts.push(inPosts[i]);
		}
	}
	outPosts.metadata = {};
	outPosts.metadata.timestamp = now.format('D MMM YYYY HH:mm:ss');
	return outPosts;
}

// Build payload for Slack notification
function makeSlackPayload(posts) {
	var articles = '',
		payload;
	posts.forEach(function (item) {
		articles += '<' + item.URL + '|' + entities.decode(item.title) + '>\n';
		articles += 'Age: ' + item.age + '\n';
		articles += 'Views: ' + utils.addCommas(item.metrics.views) + '\n\n';
	});
	payload = {
		"text"       : "Articles waiting to take off:",
		"attachments": [
			{
				"fallback": "List of articles that haven't taken off yet.",
				"color"   : "warning",
				"fields"  : [
					{
						"title": "",
						"value": articles,
						"short": false
					}
				]
			}
		],
		"icon_emoji": ":turtle:"
	};
	return JSON.stringify(payload);
}

module.exports = router;
