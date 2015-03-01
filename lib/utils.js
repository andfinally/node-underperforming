var moment = require('moment');

var addCommas = function (nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};

var conlog = function (message) {
	console.log(moment().format('D MMM YYYY HH:mm:ss') + ' | ' + message);
};

var convertToPercent = function (fraction) {
	return (fraction * 100) + '%';
};

module.exports = {
	addCommas: addCommas,
	convertToPercent: convertToPercent,
	conlog: conlog
};
