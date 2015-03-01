var config = require('../config');
var moment = require('moment');

// Add thousand separators
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

// Console log
var conlog = function (message) {
	if (config.debug) {
		console.log(moment().format('D MMM YYYY HH:mm:ss') + ' | ' + message);
	}
};

// Arbitrary conversion to make decimal score more intuitive
// Multiply by 100 and round to integer
var convertToScore = function (fraction) {
	var n = fraction * 100;
	return Math.round(n);
};

module.exports = {
	addCommas: addCommas,
	convertToScore: convertToScore,
	conlog: conlog
};
