var logger = require('./logger').getLogger('cosmos');

var Application = function() {}

Application.prototype.init = function() {
	return new Promise((resolve, reject) => {

		logger.info("=== Application inited! ===");
		resolve();
	});
}

module.exports = Application;