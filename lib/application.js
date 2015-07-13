'use strict';

var logger = require('./logger').getLogger('cosmos');

var Application = function Application() {};

Application.prototype.init = function () {
	return new Promise(function (resolve, reject) {

		logger.info('=== Application inited! ===');
		resolve();
	});
};

module.exports = Application;