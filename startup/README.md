# Automating startup of this app on Amazon AWS instance

[http://blog.angelengineering.com/2014/01/17/add-nodejs-to-an-existing-amazon-ec2-lamp-server/](http://blog.angelengineering.com/2014/01/17/add-nodejs-to-an-existing-amazon-ec2-lamp-server/)

This script starts the Node app in both forever and nodemon - should restart if files are updated or it dies.

Copy underperforming script to /etc/init.d on the AWS instance

`sudo cp underperforming /etc/init.d`

Then `sudo chmod a+x /etc/init.d/underperforming`

Then to set the script to run on startup and shutdown

`sudo chkconfig --add /etc/init.d/underperforming`

`sudo chkconfig underperforming on`

Now you should be able to control the startup with

`sudo /etc/init.d/underperforming start`

`sudo /etc/init.d/underperforming stop`

`sudo /etc/init.d/underperforming restart`

If the terminal complains that
 
`/usr/local/bin/nodemon --exitcrash is locked`

it could be because forever was unable to start properly the last time. Delete the lock file for the app to unlock

`sudo rm -f /var/lock/subsys/underperforming`

Make sure you shut down the forever process using the proper command. If you simply do `forever stop 0` and try to start 
the process with `node server.js` you may get an error message like

`events.js:85
      throw er; // Unhandled 'error' event
            ^
Error: listen EADDRINUSE
    at exports._errnoException (util.js:746:11)`
    
In this situation shut down properly using the full command.

`cd startup-automation/`
`sudo cp nodeup /etc/init.d`
`sudo chmod a+x /etc/init.d/nodeup`
`sudo chkconfig nodeup on`
`sudo /etc/init.d/nodeup start`


`forever start -w -al server.log server.js`

`ps aux | grep node`
