'use strict';

var EtcManager = require('../etcManager');
var ActorManager = require('../actorManager');

var util = require('util');
var RpcClient = require('./rpcClient');
var RpcServer = require('./rpcServer');
var logger = require('../../logger').getLogger('cosmos');
var Promise = require('bluebird');

var Rpc = function Rpc(etcManager, actor) {

	this.ignoreMethods = ['init'];

	this.etcManager = etcManager;

	var $this = this;
	this.etcManager.on('onActorsChanged', function () {
		logger.info('================== onActorsChanged');
		$this.onActorsChanged.apply($this, arguments);
	});
	this.actor = actor;

	this.rpcClients = {};

};

Rpc.prototype.init = function () {
	// register

	this.rpcServer = new RpcServer(this.actor);

	var $this = this;
	return $this.register().then(function () {

		// heartbreak for etcd
		setInterval(function () {
			return $this.register().then(function () {
				logger.info('Heartbreak Register Actor');
			});
		}, $this.etcManager.etcConfig.heartbreak * 1000);

		logger.info('=== Rpc finish started! ===');
	});
};

Rpc.prototype.call = function(actorName, funcName) {
	var $this = this;

	var client = $this.rpcClients[actorName];
	if (!client) {
		logger.error("[Rpc:call]Not found actor: %s", actorName);
		return Promise.reject(new Error("[Rpc:call]Not found actor: " + actorName));
	}

	var funcArgs = Array.prototype.slice.call(arguments, 2, arguments.length - 1);

	logger.debug("[Rpc:call] to actor: %s, funcName: %s, args: %s", actorName, funcName, funcArgs);

	return client.call(funcName, funcArgs);
}

Rpc.prototype.register = function () {
	var $this = this;
	return this.etcManager.registerActor(this.actor).then(function (isSuccess) {
		if (!isSuccess) {
			logger.error('Error registerActor!');
			return Promise.reject(new Error('Error registerActor!'));
		} else {
			logger.info('Success register rpc actor!');
		}
	});
};

// trigger by etcManager event
Rpc.prototype.onActorsChanged = function (actors) {

	// get actors, function init
	for (var key in actors) {
		var otherActor = actors[key];
		// except self
		if (otherActor.host == this.actor.config.host && 
			otherActor.rpcPort == this.actor.rpcPort) {
			logger.debug('[IGNORE]Ignore self when rpc creatation');
			continue;
		}

		var rpcClient = this.rpcClients[otherActor.name];

		if (rpcClient) {
			if (rpcClient.host == otherActor.host && 
				rpcClient.rpcPort == otherActor.rpcPort) {
				logger.debug(
					"[EXIST]exist rpc client of %s-%s:%s, no need to create again", 
					otherActor.name, otherActor.host, otherActor.rpcPort);
				continue;
			} else {
				logger.error("Diff actor: %s", otherActor.name);
				rpcClient.close();
			}
			// TODO: close old

		}
		rpcClient = new RpcClient(otherActor);


		this.rpcClients[otherActor.name] = rpcClient;

		// proxy to rpc
		// var proxyFuncs = {};

		// define the otherActor into this rpc class
		// this[actorName] = proxyFuncs;
		logger.info('[Bind RPC] bind %s to self:%s', otherActor.name, this.actor.name);
		// rpc function create
		// funcs.forEach(function (funcName) {
		// 	logger.info(util.format('Create Function: %s, From actor: %s', funcName, actor.host + ':' + actor.rpcPort));
		// 	proxyFuncs[funcName] = function () {
		// 		return new Promise(function (resolve, reject) {
		// 			return rpcClient.call(funcName).then(function (res) {
		// 				resolve(res);
		// 			})['catch'](function (err) {
		// 				reject(err);
		// 			});
		// 		});
		// 	};
		// });
	}
};

module.exports = Rpc;