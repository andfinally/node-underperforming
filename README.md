# node-underperforming
Node microservice to tell content people which recent articles are underperforming. Gets data from Metro newsfeed API and sends notifications to Slack.

## Server setup ##

http://iconof.com/blog/how-to-install-setup-node-js-on-amazon-aws-ec2-complete-guide/
http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2

## App setup ##

Save a copy of `config-sample.js` as `config.js`.
Enter the URLs for your [Slack Incoming WebHooks](https://api.slack.com/incoming-webhooks) and Post API.

## URLs ##

**JSON output:** http://XXX.XXX.XXX.XXX/api

**Send Slack notification:** http://XXX.XXX.XXX.XXX/api/slack

**Local** http://localhost:8080/api

## Forever ##

http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/

## Check running processes ##

`ps aux | grep node`

then

`kill -9 PID`
