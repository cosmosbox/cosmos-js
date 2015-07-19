'use strict';

var Promise = require('bluebird');
var logger = require('cosmos-logger').getLogger('cosmos');
var _ = require('underscore');


var ActorManager = function ActorManager(actorConfig) {
	this.config = actorConfig;

	this.name = this.config.name;

	this.handler = new actorConfig.handler();
	this.remote = new actorConfig.remote();

	this.rpcPort = -1; // init to random one
};

// save to etcd
ActorManager.prototype.__defineGetter__('info', function() {
	var info = _.clone(this.config);

	info.rpcPort = this.rpcPort;

	return info;
})

ActorManager.prototype.init = function () {
	var $this = this;
	return new Promise(function (resolve, reject) {

		var randomPort = require('random-port');
		randomPort(function(port) {
			$this.rpcPort = port;

			// get a randome port for RpcServer
			logger.info('=== ActorManager inited! ===');
			resolve();
		})

	});
};

// be called by remote
ActorManager.prototype.onRpcCall = function (funcName, funcArgs) {
	var $this = this;
	return new Promise(function (resolve, reject) {
		var func = $this.remote.__proto__[funcName];
		if (!func) {
			reject(new Error('not found func: ' + funcName));
		} else {
			var ret = func.apply($this.remote, funcArgs);
			if (ret instanceof Promise) {
				return ret.then(function (resolveValue) {
					resolve(resolveValue);
				})['catch'](function (err) {
					reject(err);
				});
			} else {
				resolve(ret);
			}
		}
	});
};
module.exports = ActorManager;