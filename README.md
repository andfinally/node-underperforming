# node-underperforming
Node microservice to tell content people which recent articles are underperforming. Gets data from Metro newsfeed API and sends notifications to Slack. Scheduled to run every half hour.

## Server setup ##

[http://iconof.com/blog/how-to-install-setup-node-js-on-amazon-aws-ec2-complete-guide/](http://iconof.com/blog/how-to-install-setup-node-js-on-amazon-aws-ec2-complete-guide/)

[http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2](http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2)

## App setup ##

Save a copy of `config-sample.js` as `config.js`. Enter the URLs for your [Slack Incoming WebHooks](https://api.slack.com/incoming-webhooks) and Post API.

## URLs ##

**JSON output on demand, no Slack notification:** http://XXX.XXX.XXX.XXX/api

**Send Slack notification on demand:** http://XXX.XXX.XXX.XXX/api/slack

**Local** http://localhost:8080/api

## Forever ##

[http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/](http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/)

[http://rusticode.com/2013/04/05/lannn-installing-node-on-aws/](http://rusticode.com/2013/04/05/lannn-installing-node-on-aws/)

`forever start -a -o out.log -e err.log server.js`

### Auto-restarting Forever with crontab ###

[http://rusticode.com/2013/04/05/lannn-installing-node-on-aws/](http://rusticode.com/2013/04/05/lannn-installing-node-on-aws/)

`sudo crontab -u ec2-user -e`

`@reboot /usr/local/bin/start -a -o out.log -e err.log /home/ec2-user/metro/underperforming/server.js`

and check with

`sudo crontab -u ec2-user -l`


## Check running processes ##

`ps aux | grep node`

then

`kill -9 PID`
