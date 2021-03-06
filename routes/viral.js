var config = require('../config');
var router = require('express').Router();
var request = require('request');
var path = require('path');
var fs = require('fs');
var mustache = require("mustache");
var moment = require('moment');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var schedule = require('node-schedule');
var slack = require('../lib/slack');
var utils = require('../lib/utils');

// Scheduled task for Slack notifications
/*var rule = new schedule.RecurrenceRule();
rule.minute = [10, 40];
var j = schedule.scheduleJob(rule, function () {
	utils.conlog('viral | Scheduled job starting');
	getLatestPosts(null, 'slack');
});*/

// HTML output of results
router.get('/', function (req, res) {
	utils.conlog('viral | URL request for HTML | /');
	getLatestPosts(res, 'html');
});

// HTML output for big screens
router.get('/big', function (req, res) {
	utils.conlog('viral | URL request for HTML big screen | /');
	getLatestPosts(res, 'big');
});

// JSON output of results
router.get('/json', function (req, res) {
	utils.conlog('viral | URL request for JSON | /json');
	getLatestPosts(res, 'json');
});

function sendHTML(res, outPosts, template) {
	var templatePath = '../html/';
	if (template && template == 'big.htm') {
		// Only taking first 3 items
		outPosts.posts = outPosts.posts.slice(0, 3);
		templatePath += 'big.htm';
	} else {
		templatePath += 'viral.htm';
	}
	var page = fs.readFileSync(path.join(__dirname, templatePath), 'utf8');
	var html = mustache.to_html(page, outPosts);
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	res.setHeader('Cache-Control', 'max-age=60');
	res.send(html);
}

function sendJSON(res, outPosts) {
	res.setHeader('Content-Type', 'application/json');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.send(outPosts);
}

function sendSlack(outPosts) {
	if (outPosts.posts.length) {
		slack.send('viral', makeSlackPayload(outPosts.posts));
	}
}

// Grab latest posts from the newsfeed API
function getLatestPosts(res, outputFormat) {
	var postsApiurl = process.env.postsApiUrl || config.postsApiUrl;
	request(postsApiurl, function (apiError, apiResponse, apiBody) {
		utils.conlog('viral | Newsfeed API response ' + apiResponse.statusCode);
		var outPosts;
		var threshold = outputFormat == 'slack' ? 45 : 10;
		if (!apiError) {
			outPosts = getList(apiBody, threshold);
			outPosts.metadata.status = 200;
			outPosts.metadata.message = 'OK';
			switch (outputFormat) {
				case 'slack':
					sendSlack(outPosts);
					break;

				case 'json':
					sendJSON(res, outPosts);
					break;

				case 'html':
					sendHTML(res, outPosts, 'viral.htm');
					break;

				case 'big':
					sendHTML(res, outPosts, 'big.htm');
					break;
			}
		} else {
			utils.conlog('viral | Newsfeed API error ' + apiError);
			res.status(500).send('viral - Newsfeed API error');
		}
	});
}

function getList(body, threshold) {

	var postsJSON = JSON.parse(body),
		inPosts = postsJSON.posts,
		outPosts = {};

	outPosts.posts = [];

	for (var i = 0; i < inPosts.length; i++) {

		// Calculate total shares for each post
		inPosts[i].metrics.totalShares = inPosts[i].metrics.shares + inPosts[i].metrics.likes + inPosts[i].metrics.tweets;
		// Calculate viralScore for each post, leaving out posts with no sharesPerView
		if (!inPosts[i].metrics.sharesPerView) {
			// sharesPerView 0 or undefined
			continue;
		}
		if (inPosts[i].metrics.clicksPerShare == 0) {
			// clicksPerShare 0, don't bother multiplying
			inPosts[i].metrics.viralScore = utils.convertToScore(inPosts[i].metrics.sharesPerView);
			if (inPosts[i].metrics.viralScore >= threshold) outPosts.posts.push(inPosts[i]);
			continue;
		}
		inPosts[i].metrics.viralScore = utils.convertToScore(inPosts[i].metrics.sharesPerView * inPosts[i].metrics.clicksPerShare);
		if (inPosts[i].metrics.viralScore >= threshold) outPosts.posts.push(inPosts[i]);
	}

	function compare(a, b) {
		if (a.metrics.viralScore > b.metrics.viralScore)
			return -1;
		if (a.metrics.viralScore < b.metrics.viralScore)
			return 1;
		return 0;
	}

	// Sort posts by viralScore
	outPosts.posts.sort(compare);
	outPosts.metadata = {
		timestamp: moment().format('D MMM YYYY HH:mm:ss')
	};

	return outPosts;
}

// Build payload for Slack notification
function makeSlackPayload(posts) {
	var articles = '',
		payload;
	posts.forEach(function (item) {
		articles += '<' + item.URL + '|' + entities.decode(item.title) + '>\n';
		articles += 'Viral score: ' + item.metrics.viralScore + '\n';
		articles += 'Total shares: ' + utils.addCommas(item.metrics.totalShares) + '\n\n';
	});
	payload = {
		"text"       : "Articles with viral promise:",
		"attachments": [
			{
				"fallback": "List of articles with a high viral score.",
				"color"   : "good",
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

module.exports = router;
