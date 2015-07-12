var logger = require('./logger').getLogger('cosmos');

class Application {

	init() {
		return new Promise((resolve, reject) => {

			logger.info("=== Application inited! ===");
			resolve();
		});
	}
}

module.exports = Application;