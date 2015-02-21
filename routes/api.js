var config = require('../config');
var express = require('express');
var router = express.Router();
var request = require('request');
var slackPayload;
var moment = require('moment');
var now = moment();
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var schedule = require('node-schedule');

// Set up scheduled task
var rule = new schedule.RecurrenceRule();
rule.minute = [0, 30];
var j = schedule.scheduleJob(rule, function(){
    console.log('SCHEDULED JOB.....');
	getLatestPosts(null, true);
});

router.get('/', function (req, res) {
	getLatestPosts(res, false);
});

router.get('/slack', function (req, res) {
	console.log('SLACK');
	getLatestPosts(null, true);
	res.status(200).send('SLACK');
});

function getLatestPosts(res, tellSlack) {
	request(config.postsApiUrl, function (apiError, apiResponse, apiBody) {
		console.log('NEWSFEED API RESPONSE ' + apiResponse.statusCode);
		if (!apiError) {
			var postList = getList(apiBody, tellSlack);
			if (res) {
				// Output a JSON response
				res.setHeader('Content-Type', 'application/json');
				res.send(postList);
			}
			if (slackPayload) {
				// Slack notification
				sendSlackNotification();
			}
		} else {
			console.log(apiError);
		}
	});
}

function getList(body, tellSlack) {
	var postsJSON = JSON.parse(body),
		inPosts = postsJSON.posts,
		outPosts = {},
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
	outPosts.metadata.push({'timestamp': now.toISOString()});
	if (tellSlack) {
		setSlackPayload(outPosts.posts);
	}
	return outPosts;
}

function sendSlackNotification() {
	console.log('SLACK NOTIFY');
	request({
		uri   : config.slackIncomingWebHookUrl,
		method: 'POST',
		body  : JSON.stringify(slackPayload)
	}, slackCallback);
}

function slackCallback(error, response, body) {
	if (error) {
		console.log(error);
	} else if (response.statusCode !== 200) {
		// inform user that our Incoming WebHook failed
		console.log(new Error('Incoming WebHook: ' + response.statusCode + ' ' + body));
	} else {
		//console.log(res.status(200).end());
	}
}

function setSlackPayload(posts){
	var articles = '';
	posts.forEach(function(item){
		articles += '<' + item.URL + '|' + entities.decode(item.title) + '>\n';
		articles += 'Age: ' + item.age + '\n';
		articles += 'Views: ' + item.metrics.views + '\n\n';
	});
	slackPayload = {
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
}

module.exports = router;

