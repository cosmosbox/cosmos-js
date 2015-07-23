'use strict';
'use strict';

var EtcManager = require('./etcManager');
var Rpc = require('./rpc');
var ActorManager = require('./actorManager');
var Logger = require('cosmos-logger');
var logger = Logger.getLogger('cosmos');
var appConfig = require('./configDefault');

var CosmosActor = function CosmosActor(appConfig, actorConfig) {

	this.isStarted = false;
	this.appConfig = appConfig;
	this.actorConfig = actorConfig;

	this.actorMgr = new ActorManager(this.actorConfig);

	this.etc = new EtcManager(this.appConfig.etcConfig, this.actorMgr);
	this.rpc = new Rpc(this.etc, this.actorMgr);
};

CosmosActor.prototype.start = function () {
	var $this = this;
	return $this.etc.init().then(function () {
		return $this.actorMgr.init();
	}).then(function () {
		return $this.rpc.init();
	}).then(function () {
		return new Promise(function(resolve) {
			logger.info('=== CosmosActor finish started! ===');
			$this.isStarted = true;
			resolve();
		});
	});
};

module.exports = CosmosActor;