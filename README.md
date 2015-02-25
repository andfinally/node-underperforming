# node-underperforming
Node microservice to notify content people which recent articles are underperforming. Gets data from Metro newsfeed API and sends a list of articles between 60 and 90 minutes old which have had less than 1,000 views as a Slack notification. Scheduled to run every half hour.

## Server setup ##

[http://iconof.com/blog/how-to-install-setup-node-js-on-amazon-aws-ec2-complete-guide/](http://iconof.com/blog/how-to-install-setup-node-js-on-amazon-aws-ec2-complete-guide/)

[http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2](http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2)

## App setup ##

Save a copy of `config-sample.js` as `config.js`. Enter the URLs for your [Slack Incoming WebHooks](https://api.slack.com/incoming-webhooks) and Post API.

## URLs ##

**JSON output on demand, no Slack notification:** http://XXX.XXX.XXX.XXX/underperforming

**Send Slack notification on demand:** http://XXX.XXX.XXX.XXX/underperforming/slack

**Local** http://localhost:8080/underperforming

## Auto restart ##

Add a startup shell script to /etc/init.d on the server and use `chkconfig` to add it to the autorun processes. See the README.md in /startup-automation.

## Random notes ##

### Forever ###

[http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/](http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/)

[http://rusticode.com/2013/04/05/lannn-installing-node-on-aws/](http://rusticode.com/2013/04/05/lannn-installing-node-on-aws/)

`forever start -a -o out.log -e err.log server.js`

### Check running processes ###

`ps aux | grep node`

then

`kill -9 PID`
