
class Application {

	init() {
		return new Promise((resolve, reject) => {

			console.log("=== Application inited! ===");
			resolve();
		});
	}
}

module.exports = Application;