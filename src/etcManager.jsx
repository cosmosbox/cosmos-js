var Promise = require('bluebird');

var Etcd = require('node-etcd');
var _ = require('underscore');

class EtcManager {
	constructor(host : string, port : int) {
		this.theEtcd = new Etcd(host, port);
		Promise.promisifyAll(this.theEtcd);  // promise
	}

	init() {
		return new Promise((resolve, reject) => {
			console.log("=== EtcManager inited! ===");
			resolve();
		});
	}

	_ensureEtcd() {

		var $this = this;
		return new Promise(function(resolve) {

			resolve($this.theEtcd);
		});
	}

	getKey(key) {
		var $this = this;

		return new Promise(function(resolve, reject) {

			$this._ensureEtcd()
				.then(function(etcd) {
					return etcd.getAsync(key);
				})
				.then(function(getValue) {
					var jValue = JSON.parse(getValue[0].node.value);
					resolve(jValue);
				}).catch(function(err) {
					if (err.errorCode == 100) {  // key not found
						resolve(null);
					} else {
						reject(err);
					}
				});

		});
	}

	setKey(key, value) {
		var $this = this;
		return new Promise(function(resolve, reject) {

			$this._ensureEtcd()
				.then(function(etcd) {
					return etcd.setAsync(key, value);
				})
				.then(function(result) {
					resolve(result);
				}).catch(function(err) {
					reject(err);
				});
		});
	}

	getActors() {
		var $this = this;
		return new Promise(function(resolve, reject) {
			$this.getKey($this.getKeyName())
				.then(function(value) {
					if (value == null) {
						resolve({});
					} else {
						var infos = value;
						resolve(infos);
					}
					
				})
				.error(function(err) {
					reject(err);
				});
		});
	}

	getKeyName() {
		return "cosmos:actorInfos14";
	}

	registerActor(actorMgr) {
		var $this = this;
		return new Promise((resolve, reject) => {
			return $this.getKey($this.getKeyName())
			.then(function(value) {

				// get no actors, so create it
				if (value == null) {
					value = {};
				}
				// TODO: Check exist
				// console.dir(actorConfig);

				// the object save on the Etcd, include:
				// * actor config
				// * actor all remote functions
				var actorInfo = _.clone(actorMgr.config);
				actorInfo.functions = [];
				var funcs = Object.getOwnPropertyNames(actorMgr.remote.__proto__);
				funcs.forEach(funcName => {
					console.log("Register actor func: " + funcName);
					actorInfo.functions.push(funcName);
				});
				value[actorInfo.name] = actorInfo;


				var jsonValue = JSON.stringify(value);
				return $this.setKey($this.getKeyName(), jsonValue);
				
			})
			.then(setRet => {
				// set success!
				console.info(setRet);
				resolve(true);
			})
			.error(function(err) {
				reject(err);
			});
		});
	}
}
module.exports = EtcManager;