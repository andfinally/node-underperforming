# ViralBot
Little Node app to notify content people which recent articles are underperforming. Gets data from news API and sends a list of articles between 60 and 90 minutes old which have had less than 1,000 views as a Slack notification. Scheduled to run every half hour.

## Server setup ##

[http://iconof.com/blog/how-to-install-setup-node-js-on-amazon-aws-ec2-complete-guide/](http://iconof.com/blog/how-to-install-setup-node-js-on-amazon-aws-ec2-complete-guide/)

[http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2](http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2)

## App setup ##

Save a copy of `config-sample.js` as `config.js`. Enter the URLs for your [Slack Incoming WebHooks](https://api.slack.com/incoming-webhooks) and Post API. Alternatively, set the config properties in config-sample.js as environment variables. 

## URLs ##

**JSON output on demand, no Slack notification:** http://XXX.XXX.XXX.XXX/underperforming

**Send Slack notification on demand:** http://XXX.XXX.XXX.XXX/underperforming/slack

**Local** http://localhost:8080/underperforming

## Auto restart ##

Add a startup shell script to /etc/init.d on the server and use `chkconfig` to add it to the autorun processes. See the README.md in /startup-automation.

The `nodeup` shell script in the startup directory runs server.js in forever in watch mode. The app should restart on file change, crash or reboot. To enable the process on a Red Hat environment:

Copy the script to /etc/init.d:
 
`cd startup`

`sudo cp nodeup /etc/init.d`

Give it executable permission:

`sudo chmod a+x /etc/init.d/nodeup`

Add it to chkconfig:

`sudo chkconfig nodeup on`

Do the initial start:

`sudo /etc/init.d/nodeup start`

## Random notes ##

### Forever ###

[http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/](http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/)

[http://rusticode.com/2013/04/05/lannn-installing-node-on-aws/](http://rusticode.com/2013/04/05/lannn-installing-node-on-aws/)

`forever start -a -o out.log -e err.log server.js`

`forever start -w --watchDirectory=$APP_DIR --sourceDir=$APP_DIR -al $APP_DIR/server.log server.js`

### Check running processes ###

`ps aux | grep node`

then

`kill -9 PID`
