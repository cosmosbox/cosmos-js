'use strict';

var Promise = require('bluebird');

var Etcd = require('node-etcd');

var _ = require('underscore');
var logger = require('../logger').getLogger('cosmos');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var id = 10000;
var EtcManager = function EtcManager(etcConfig, actor) {

	EventEmitter.call(this);

	this.actorsEtc = null;

	this.etcConfig = etcConfig;

	this.actor = actor;
	var host = etcConfig.host;
	var port = etcConfig.port;
	this.theEtcd = new Etcd(host, port);
	Promise.promisifyAll(this.theEtcd); // promise

	this.$id = id++;
};

util.inherits(EtcManager, EventEmitter);

EtcManager.prototype.init = function () {
	var $this = this;

	$this.initActorsWatcher(); // TODO: 避免内存泄露，重复... close watcher
	return new Promise(function (resolve, reject) {
		logger.info('=== EtcManager inited! ===');
		resolve();
		
	});
};

EtcManager.prototype._ensureEtcd = function () {

	var $this = this;
	return new Promise(function (resolve) {

		resolve($this.theEtcd);
	});
};

// Let the class return by etcd, transform to JSON
EtcManager.prototype._etcdNodeToJSON = function (etcdNode) {

	var jValue = null;
	if (etcdNode.dir == true) {
		// nodes
		var dirKey = etcdNode.key;

		jValue = {};
		for (var index in etcdNode.nodes) {
			var childNode = etcdNode.nodes[index];
			var key = childNode.key.replace(dirKey, '') // remove dir prefix key
			.replace('/', ''); // remove "/key" 's  /
			jValue[key] = this._parseJSON(childNode.value);
		}
	} else {
		jValue = this._parseJSON(etcdNode.value);
	}
	return jValue;
};

EtcManager.prototype.getKey = function (key) {
	var $this = this;

	return new Promise(function (resolve, reject) {

		$this._ensureEtcd().then(function (etcd) {
			return etcd.getAsync(key);
		}).then(function (getValue) {

			var node = getValue[0].node; // node...
			var jValue = $this._etcdNodeToJSON(node);
			resolve(jValue);
		})['catch'](function (err) {
			if (err.errorCode == 100) {
				// key not found
				resolve(null);
			} else {
				reject(err);
			}
		});
	});
};

// If actors changed, log it!
EtcManager.prototype.initActorsWatcher = function () {
	var $this = this;

	var onWatch = function onWatch() {
		$this.onWatchActorsLastChangedKey.apply($this, arguments);
	};
	this.watcher = this.theEtcd.watcher('/'+this.getLastChangedKey());
	this.watcher.on('change', onWatch); // Triggers on all changes
	this.watcher.on('set', onWatch); // Triggers on specific changes (set ops)
	this.watcher.on('delete', onWatch); // Triggers on delete.
	// this.watcher2 = etcd.watcher("key", null, {recursive: true});
	var $this = this;
	
	this.watcher.on('error', function () {
		logger.error('[initActorsWatcher]watcher error! reconnecct');
		$this.initActorsWatcher();
	});
};

// parse or return this string
EtcManager.prototype._parseJSON = function (str) {
	try {
		return JSON.parse(str);
	} catch (e) {
		return str;
	}
};
// on master Actors changed!
EtcManager.prototype.onWatchActorsLastChangedKey = function (etcdValue) {
	// get actors now

	this.getActors(true).then(function () {
		logger.info('[onWatchActorsLastChangedKey] retry getActors');
	});
	// var jValue = this._etcdNodeToJSON(etcdValue.node);//JSON.parse(etcdValue.node.value);
	// this.actorsEtc = jValue;
};

EtcManager.prototype.setKey = function (key, value, ttl) {
	if (ttl === undefined) {
		ttl = 60; // 60s to destroy key
	}

	var $this = this;
	return new Promise(function (resolve, reject) {

		$this._ensureEtcd().then(function (etcd) {
			return etcd.setAsync(key, value, { ttl: ttl });
		}).then(function (result) {
			resolve(result);
		})['catch'](function (err) {
			reject(err);
		});
	});
};

// first time: go to etcd and get,
// after first get, watcher
EtcManager.prototype.getActors = function (forceRetry) {

	var $this = this;
	return new Promise(function (resolve, reject) {

		if ($this.actorsEtc == null || forceRetry) {
			return $this.getKey($this.getDirName()).then(function (value) {
				if (value == null) {
					resolve({});
				} else {
					var infos = value;
					resolve(infos);
					logger.info('================== emit onActorsChanged');
					$this.emit('onActorsChanged', infos);

					$this.actorsEtc = infos;
				}
			}).error(function (err) {
				reject(err);
			});
		} else {
			logger.warn('cache actors');
			resolve($this.actorsEtc);
		}
	});
};

EtcManager.prototype.getDirName = function () {
	return 'cosmos-cosmos-actors2/';
};
EtcManager.prototype.getKeyName = function () {
	return this.getDirName() + this.actor.name;
};

// a key to watch!
EtcManager.prototype.getLastChangedKey = function () {
	return 'cosmos-cosmos-actors2-last-changed-time';
};

EtcManager.prototype.registerActor = function (actorMgr) {
	
	var $this = this;

	return new Promise(function (resolve, reject) {

		// the object save on the Etcd, include:
		// * actor config
		// * actor all remote functions
		var actorInfo = _.clone(actorMgr.info);
		actorInfo.functions = [];
		var funcs = Object.getOwnPropertyNames(actorMgr.remote.__proto__);
		funcs.forEach(function (funcName) {
			// logger.info("Register actor func: " + funcName);
			actorInfo.functions.push(funcName);
		});

		var jsonValue = JSON.stringify(actorInfo);

		return $this.setKey($this.getKeyName(), jsonValue).then(function (setRet) {
			// set success!
			// logger.warn(setRet);
			return $this.setKey($this.getLastChangedKey(), _.now(), 100000);
		}).error(function (err) {
			reject(err);
		}).then(function(isSuccess) {
			if (!isSuccess) {
				logger.error("registerActor failed!");
				reject(new Error('registerActor Failed!'));
			} else {
				logger.warn('=== registerActor success!');
				resolve(true);
			}
		}).catch(function(err) {
			logger.error(err);
			reject(err);
		});
		// .then(function() {
		// 	// 首次注册，获取一次信息
		// 	return this.getActors(true).then(function () {
		// 		logger.info('[registerActor] refresh get actors!');
		// 	});
		// });
	});
};
module.exports = EtcManager;