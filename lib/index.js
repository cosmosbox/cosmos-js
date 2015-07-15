var Promise = require('bluebird');

var logger = require('cosmos-logger').getLogger('cosmos');

var ProjectLoader = require('./projectLoader');

var CosmosActor = require('cosmos-actor');

var path = require('path');

var Cosmos = function() {

	this.scriptPath = require.main.filename;
	this.projectPath = path.dirname(this.scriptPath);

	this.projectLoader = new ProjectLoader(this.projectPath);

	this.objects = {};
}

Cosmos.prototype.init = function(actorName) {
	this.actorName = actorName;
}

Cosmos.prototype.start = function() {
	var $this = this;
	return new Promise(function(resolve, reject) {

		var appConfig = $this.config.app;
		var actorConfig = $this.config.actors[$this.actorName];
		console.dir($this.actorTypes);
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
			
			_instance = new Cosmos();
		}
		return _instance;
	}
});