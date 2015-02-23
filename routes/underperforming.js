var config = require('../config');
var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var schedule = require('node-schedule');

// Scheduled task for Slack notifications
var rule = new schedule.RecurrenceRule();
rule.minute = [0, 30];
var j = schedule.scheduleJob(rule, function () {
	conlog('Scheduled job');
	getLatestPosts(null, true);
});

// JSON output of results
router.get('/', function (req, res) {
	conlog('URL request for JSON');
	getLatestPosts(res, false);
});

// Triggers Slack notification on demand
router.get('/slack', function (req, res) {
	conlog('URL request for Slack notification');
	getLatestPosts(null, true);
	res.status(200).send('SLACK');
});

// Grab latest post from the newsfeed API
function getLatestPosts(res, tellSlack) {
	request(config.postsApiUrl, function (apiError, apiResponse, apiBody) {
		conlog('Newsfeed API response ' + apiResponse.statusCode);
		if (!apiError) {
			var outPosts = getList(apiBody);
			if (res) {
				// Output JSON response
				res.setHeader('Content-Type', 'application/json');
				res.send(outPosts);
			}
			if (tellSlack && outPosts.posts.length) {
				// Tell Slack
				conlog('Slack notification');
				sendSlackNotification(outPosts.posts);
			}
		} else {
			conlog('Newsfeed API error ' + apiError);
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
	outPosts.metadata = [];
	outPosts.metadata.push({'timestamp': now.format('D MMM YYYY HH:mm:ss')});
	return outPosts;
}

// Send post request to Slack incoming webhook URL
function sendSlackNotification(posts) {
	request({
		uri   : config.slackIncomingWebHookUrl,
		method: 'POST',
		body  : makeSlackPayload(posts)
	}, slackCallback);
}

function slackCallback(error, response, body) {
	if (error) {
		conlog('Slack request error ' + error);
	} else if (response.statusCode !== 200) {
		conlog(new Error('Incoming WebHook: ' + response.statusCode + ' ' + body));
	}
}

// Build payload for Slack notification
function makeSlackPayload(posts) {
	var articles = '',
		payload;
	posts.forEach(function (item) {
		articles += '<' + item.URL + '|' + entities.decode(item.title) + '>\n';
		articles += 'Age: ' + item.age + '\n';
		articles += 'Views: ' + item.metrics.views + '\n\n';
	});
	payload = {
		"text"       : "These articles haven't taken off yet.",
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
		]
	};
	return JSON.stringify(payload);
}

function conlog(message) {
	console.log(moment().format('D MMM YYYY HH:mm:ss') + ' | ' + message);
}

module.exports = router;
