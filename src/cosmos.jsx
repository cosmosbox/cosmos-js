var Application = require('./application');
var EtcManager = require('./etcManager');
var Rpc = require('./rpc');
var ActorManager = require('./actorManager');
var Logger = require('./logger');
var logger = Logger.getLogger('cosmos');
var appConfig = require('./configDefault');

var ProjectLoader = require('./projectLoader');

var Cosmos = function(appConfig, actorConfig) {

	this.isStarted = false;
	this.appConfig = appConfig;
	this.actorConfig = actorConfig;

	this.app = new Application();
	this.actorMgr = new ActorManager(this.actorConfig);

	this.etc = new EtcManager(this.appConfig.etcConfig, this.actorMgr);

	this.rpc = new Rpc(this.etc, this.actorMgr);
}

Cosmos.prototype.start = function() {
	var $this = this;
	return $this.app.init()
		.then(() => $this.etc.init())
		.then(() => $this.actorMgr.init())
		.then(() => $this.rpc.init())
		.then(() => {
			logger.info("=== Cosmos finish started! ===");
			$this.isStarted = true;
		});
}

Cosmos.prototype.getApp = function() {
	return this.app;
}

var _instance: Cosmos = null;

module.exports = {
	Cosmos: Cosmos,

	getApp: function() {
		// use project loader  convenience load project structure folder!
		if (_instance == null) {
			var projectLoader = new ProjectLoader(process.cwd()); // TODO: pass app.js  dir path;
			_instance = new Cosmos(projectLoader.appConfig, projectLoader.actorConfig);
			_instance.start();
		}
		return _instance.getApp();
	},

	getLogger: Logger.getLogger
}