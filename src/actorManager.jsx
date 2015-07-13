var Promise = require('bluebird');
var logger = require('./logger').getLogger('cosmos');

var ActorManager = function(actorConfig) {
	this.config = actorConfig;
	
	this.name = this.config.name;
	this.handler = new actorConfig.handler();
	this.remote = new actorConfig.remote();

}

ActorManager.prototype.init = function() {
	return new Promise((resolve, reject) => {
		logger.info("=== ActorManager inited! ===");
		resolve();
	});
}


// be called by remote
ActorManager.prototype.onRpcCall = function(funcName, funcArgs) {
	var $this = this;
	return new Promise((resolve, reject) => {
		var func = $this.remote.__proto__[funcName];
		if (!func) {
			reject(new Error('not found func: ' + funcName))
		} else {
			var ret = func.apply($this.remote, funcArgs);
			if (ret instanceof Promise) {
				return ret.then(resolveValue=> {
					resolve(resolveValue)
				}).catch(err => {
					reject(err);
				});
			} else {
				resolve(ret);
			}
		}
	});
}
module.exports = ActorManager;