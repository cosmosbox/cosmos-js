var Promise = require('bluebird');
var logger = require('cosmos-logger').getLogger('cosmos');
var ProjectLoader = require('./projectLoader');
var CosmosActor = require('cosmos-actor');
var path = require('path');

var Cosmos = function(actorName) {

	this.scriptPath = require.main.filename;
	this.projectPath = path.dirname(this.scriptPath);

	this.projectLoader = new ProjectLoader(this.projectPath);
	
	this.actorName = actorName;

	this.objects = {};
}

Cosmos.prototype.start = function() {
	var $this = this;
	return new Promise(function(resolve, reject) {

		var appConfig = $this.config.app;
		var actorConfig = $this.config.actors[$this.actorName];
		actorConfig.handler = $this.actorTypes[actorConfig.type].handler;
		actorConfig.remote = $this.actorTypes[actorConfig.type].remote;
		if (actorConfig.handler == null) {
			reject(new Error("Cannot load actor Handler"));
			return;
		}
		if (actorConfig.remote == null) {
			reject(new Error("Cannot load actor Remote"));
			return;
		}


		$this.actor = new CosmosActor(appConfig, actorConfig);

		logger.info("[Starting Actor] %s", $this.actorName);

		setTimeout(resolve, 3000);
	
	});
}

Cosmos.prototype.__defineGetter__('actorTypes', function() {

	return this.projectLoader.getActorTypes();
});

Cosmos.prototype.__defineGetter__('config', function() {

	return this.projectLoader.getConfigs();
});


Cosmos.prototype.get = function(key) {
	return this.objectsSync[key];
}
Cosmos.prototype.set = function(key, value) {
	this.objectsSync[key] = value;
}





module.exports.Cosmos = Cosmos;


var _instance = null;

Object.defineProperty(module.exports, 'app', {
	get : function() {

		// use project loader  convenience load project structure folder!
		
		if (_instance == null) {
			
			isEntry = true;


			var program = require('commander');

			program.version('0.0.1');
			program.description('Cosmos -- lightweight distributed framework')
			program.option('-n, --actorName [name]', 'Actor Name in config');
			program.parse(process.argv);

			if (program.actorName) {

				var actorName = program.actorName;
				console.log('new actor ....... %s', actorName);

				_instance = new Cosmos(actorName);

			} else {

				console.log('please --help');
				process.exit()
			}
		}

		return _instance;
	}
});